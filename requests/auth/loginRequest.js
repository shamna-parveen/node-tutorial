import asyncHandler from "express-async-handler";
import { make, Password } from "simple-body-validator";

const loginValidation = asyncHandler(async (req, res, next) => {
  try {
    const rules = {
      email: "required|email",
      password: [
        "required",
        Password.create().min(8).mixedCase().numbers().symbols(),
      ],
    };

    const validator = make().setData(req.query).setRules(rules);
    if (!validator.validate()) {
      const errors = validator.errors().all();
      res.status(422).json({
        status: false,
        message: "Validation failed",
        errors: errors,
      });
    } else {
      // Call next only if validation passes
      next(); // Call next to proceed to the next middleware
    }
  } 
  catch (error) {
    // If there's an error, pass it to the Express error handling middleware
    // next(error);
  }
});

export { loginValidation };
