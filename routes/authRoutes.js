import 
    AuthController
   from "../controllers/authControllers.js";

  import express from "express";
  const auth = new AuthController()
  const router = express.Router();
  
  router.route('/login').post(auth.login)

  export default router;
  