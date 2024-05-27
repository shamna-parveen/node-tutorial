import Employee from "../models/employee.js";
import Role from "../models/role.js";

const employeeSeeder = () => {
  // Insert Empoloyee
  const employee = {
    name: "Super Admin",
    email: "info@exampl.com",
    password: "Admin123,.",
    role: "Super Admin",
    guard: "admin",
  };

  const seedEmployee = async () => {
    const existingEmployee = await Employee.findOne({
      email: employee.email,
    });
    if (!existingEmployee) {
      const existingRole = await Role.findOne({
        name: employee.role,
      });
      if (!existingRole) {
        const role = new Role({
          name: employee.role,
        });
        role.save();
      }
      const newEmployee = new Employee(employee);
      await newEmployee.save();
    }
  };
  seedEmployee();
};

export default employeeSeeder;
