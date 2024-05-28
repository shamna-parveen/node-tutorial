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
    if (loginDetails) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
          role:userData.role
        };

        next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { protect };
