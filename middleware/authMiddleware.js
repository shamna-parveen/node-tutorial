import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import LoginDetailsRepository from "../repositories/loginDetailsRepository.js";

const authRepo = new userRepository();
const loginDetailRepo = new LoginDetailsRepository();

const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {

    console.log("No authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token found in authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const loginDetails = await loginDetailRepo.getLoginDetails(token);
    if (!loginDetails) {
      console.log("No login details found for token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.log("Token expired, refreshing...");
        const newToken = await refreshAuthToken(token);
        if (!newToken) {
          console.log("Failed to refresh token");
          return res.status(401).json({ message: "Unauthorized" });
        }
        decoded = jwt.verify(newToken, process.env.JWT_SECRET);
        res.setHeader("authorization", `Bearer ${newToken}`);
        console.log("New token generated and sent in response header");
      } else {
        console.log("Token verification failed", error);
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    if (decoded) {
      const { userId } = decoded;
      const userData = await authRepo.findById(userId);
      if (!userData) {
        console.log("User not found for decoded userId");
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.session) {
        req.session = {}; // Ensure req.session is initialized
      }
      req.session.user = {
        id: userData._id,
        email: userData.email,
        role_id:userData.role_id,
      };
      next();

    } else {
      console.log("Decoded token is invalid");
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const refreshAuthToken = async (oldToken) => {
  try {
    const decoded = jwt.decode(oldToken);
    const { userId } = decoded;
    const userData = await authRepo.findById(userId);
    if (!userData) {
      console.log("User not found during token refresh");
      return null;
    }
    const newToken = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await loginDetailRepo.updateLoginDetails(userData._id, newToken); // Assuming you update the login details repository
    return newToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export { protect };
