import Employee from "../models/employee.js";

export default class UserRepository {
  /**find by id  */
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
    const newEmployee = new Employee();

    Object.keys(data).forEach((key) => {
      newEmployee[key] = data[key];
    });
    newEmployee.save();
    return newEmployee;
  }
  /**
   * Get Employee By Mail
   * @param String email
   * @return Employee employee
   */
  async getEmployeeByEmail(email) {
    const employee = await Employee.findOne({ email: email });
    if (employee) {
      return employee;
    }
    return employee;
  }
  /**
   * Update Employee
   * @param Array employeeDetails
   * @return Employee employeeData
   */
  async updateEmployee(employeeDetails) {
    const employeeData = await Employee.findById({
      _id: employeeDetails.id,
    });
    if (!employeeData) {
      return null;
    }
    Object.assign(employeeData, employeeDetails);
    await employeeData.save();

    return employeeData
  }
}
