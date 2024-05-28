import Employee from '../models/employee.js';

export default class UserRepository {
  async findById(userId) {
    const user = await Employee.findById(userId);
    return user;
  }
    /**
     * Add Employee
     * @param Array data
     * @return User newEmployee
     */
    async addEmployee(data) {
      const newEmployee = new Employee()

      Object.keys(data).forEach((key) => {
          newEmployee[key] = data[key]
      })
      newEmployee.save()
      return newEmployee
  }
}
