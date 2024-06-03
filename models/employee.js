import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
    },
    permissions: {
      type: [String],  // Explicitly defining the permissions as an array of strings
      required: false,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
  },
    
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//compare the hashed password with the password that the user sends in the request.

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
