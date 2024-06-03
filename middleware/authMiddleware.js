import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import LoginDetailsRepository from "../repositories/loginDetailsRepository.js";

const authRepo = new userRepository();
const loginDetailRepo = new LoginDetailsRepository();

const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {

    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const loginDetails = await loginDetailRepo.getLoginDetails(token);
    if (!loginDetails) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const newToken = await refreshAuthToken(token);
        if (!newToken) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        decoded = jwt.verify(newToken, process.env.JWT_SECRET);
        res.setHeader("authorization", `Bearer ${newToken}`);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    if (decoded) {
      const { userId } = decoded;
      const userData = await authRepo.findById(userId);
      if (!userData) {
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
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export { protect };
