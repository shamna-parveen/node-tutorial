import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import LoginDetailsRepository from "../repositories/loginDetailsRepository.js";
const authRepo = new userRepository();
const loginDetailRepo = new LoginDetailsRepository();
/**
 * @DESC Verify JWT from authorization header Middleware
 * This middleware checks for a valid JWT in the Authorization header,
 * verifies its authenticity, and retrieves the associated user information.
 */
const protect = async (req, res, next) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    // If no Authorization header is present, return Unauthorized status
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Extract the JWT token from the Authorization header
  const token = authHeader.split(" ")[1];
  if (!token) {
    // If no token is found, return Unauthorized status
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    //Get login details with token
    const loginDetails = await loginDetailRepo.getLoginDetails(token);
    if (loginDetails) {
      // Verify the token using the JWT_SECRET stored in environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        // Extract the user ID from the decoded token
        const { userId } = decoded;
        // Find the user based on the retrieved user ID
        const user = await authRepo.findById(userId);
        if (!user) {
          // If user not found, return Unauthorized status
          return res.status(401).json({ message: "Unauthorized" });
        }
        // Store the user data in the request session
        req.session.user = {
          id: user.key_id,
          email: user.email,
        };
        // Continue with the next middleware or route handler
        next();
      } else {
        // If decoding fails, return Unauthorized status
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      // If token is not matching with logindetails
      return res.status(401).json({ message: " login details not found" });
    }
  } catch (error) {
    // If an error occurs during token verification, return Unauthorized status
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export { protect };