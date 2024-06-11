import Employee from "../models/employee.js";
import Role from "../models/role.js";

const employeeSeeder = async () => {
  const employeeData = {
    name: "Super Admin",
    email: "info@example.com",
    password: "Admin@123,.",
    role_id: null, // Initializing role_id to null
    // permissions: ["employee-create", "employee-update", "employee-delete", "employee-view", "product-create", "product-view", "product-delete", "product-update"],
  };

  try {
    const existingEmployee = await Employee.findOne({ email: employeeData.email });
    if (existingEmployee) {
      console.log("Employee already exists");
      return;
    }

    const role = await Role.findOne({ name: employeeData.name }); // Find role by name
    if (!role) {
      console.error("Role does not exist:", employeeData.name);
      return;
    }

    employeeData.role_id = role._id; // Set role ID
    const newEmployee = new Employee(employeeData);
    await newEmployee.save();
    console.log("Employee seeded successfully");
  } catch (error) {
    console.error("Error seeding employee:", error);
  }
};

export default employeeSeeder;
