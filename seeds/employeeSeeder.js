import Employee from "../models/employee.js";
import Role from "../models/role.js";

const employeeSeeder = () => {
  const employee = {
    name: "Super Admin",
    email: "info@example.com",
    password: "Admin123,.",
    role: "Super Admin",
    permissions: ["employee-create", "employee-update", "employee-delete", "employee-view", "product-create", "product-view", "product-delete", "product-update"],
  };

  const seedEmployee = async () => {
    try {
      const existingEmployee = await Employee.findOne({ email: employee.email });
      if (!existingEmployee) {
        const newEmployee = new Employee(employee);
        await newEmployee.save();
        console.log("Employee seeded successfully");
      } else {
        console.log("Employee already exists");
      }
    } catch (error) {
      console.error("Error seeding employee:", error);
    }
  };
  seedEmployee();
};

export default employeeSeeder;
