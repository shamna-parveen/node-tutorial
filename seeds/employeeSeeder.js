import Employee from "../models/employee.js";
import Role from "../models/role.js";

const employeeSeeder = () => {
  // Insert Empoloyee
  const employee = {
    name: "Super Admin",
    email: "info@exampl.com",
    password: "Admin123,.",
    role: "Super Admin",
  };

  const seedEmployee = async () => {
    const existingEmployee = await Employee.findOne({
      email: employee.email,
    });
    if (!existingEmployee) {
      const newEmployee = new Employee(employee);
      await newEmployee.save();
    }
  };
  seedEmployee();
};

export default employeeSeeder;
