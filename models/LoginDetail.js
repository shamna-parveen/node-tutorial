import mongoose from 'mongoose';

const loginDetailSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Employee'
    },
    email: {
      type: String,
      required: true,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const LoginDetail = mongoose.model('LoginDetail', loginDetailSchema);

export default LoginDetail;
