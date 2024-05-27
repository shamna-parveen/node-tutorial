import asyncHandler from "express-async-handler";
/**
 * @swagger
 * /users/get:
 *   get:
 *     tags:
 *       - Users
 *     summary: Return logged in user details
 *     produces:
 *       - application/json
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */

const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      status: true,
      message: "User profile details.",
      data: req.user,
    });
  } else {
    res.json({
      status: false,
      message: "User not found",
      data: [],
    });
  }
});
export { getUserProfile,}