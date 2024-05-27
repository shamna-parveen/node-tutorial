import LoginDetail from '../models/LoginDetail.js';

export default class LoginDetailsRepository {
  async addLoginDetails(userId, email, status, token) {
    const loginDetail = new LoginDetail({
      userId,
      email,
      status,
      token,
    });
    await loginDetail.save();
  }

  async getLoginDetails(token) {
    const loginDetail = await LoginDetail.findOne({ token });
    return loginDetail;
  }
}
