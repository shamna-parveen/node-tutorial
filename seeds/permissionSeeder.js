import Permission from "../models/permission.js";

const permissionSeeder = () => {
  // Insert permissions
  const permissions = [
    { name: "role-create", display_name: "Create Role", category: "Role" },
    { name: "role-view", display_name: "View Role", category: "Role" },
    { name: "role-update", display_name: "Update Role", category: "Role" },
    { name: "role-delete", display_name: "Delete Role", category: "Role" },

    {
      name: "emoloyee-create",
      display_name: "Create Employee",
      category: "Employee",
    },
    {
      name: "emoloyee-view",
      display_name: "View Employee",
      category: "Employee",
    },
    {
      name: "emoloyee-update",
      display_name: "Update Employee",
      category: "Employee",
    },
    {
      name: "emoloyee-delete",
      display_name: "Delete Employee",
      category: "Employee",
    },

    {
      name: "category-create",
      display_name: "Create Category",
      category: "Category",
    },
    {
      name: "category-view",
      display_name: "View Category",
      category: "Category",
    },
    {
      name: "category-update",
      display_name: "Update Category",
      category: "Category",
    },
    {
      name: "category-delete",
      display_name: "Delete Category",
      category: "Category",
    },
  ];

  const seedPermissions = async () => {
    await Permission.deleteMany({});
    for (const permission of permissions) {
      const existingPermission = await Permission.findOne({
        name: permission.name,
      });
      if (!existingPermission) {
        const newPermission = new Permission(permission);
        await newPermission.save();
      }
    }
  };
  seedPermissions();
};

export default permissionSeeder;
