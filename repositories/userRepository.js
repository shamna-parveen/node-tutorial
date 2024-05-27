import User from '../models/employee.js';

export default class UserRepository {
  async findById(userId) {
    const user = await User.findById(userId);
    return user;
  }
}
