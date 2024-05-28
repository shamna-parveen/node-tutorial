import Role from "../models/role.js";

const roleSeeder = () => {
  // Insert Role
  const roleData = [
    {
      name: "Super Admin",
      description: "Has full access to all features and settings.",
      permissions: ["emoloyee-create", "emoloyee-update", "emoloyee-delete","emoloyee-view","product-create","product-view","product-delete","product-update"],
    },
    {
      name: "Admin",
      description: "Has access to most features and settings.",
      permissions: ["product-create","product-view","product-delete","product-update"]
    },
    {
      name: "User",
      description: "Has limited access to features.",
      permissions: ["product-create","product-view","product-delete","product-update"]
    },
  ];

  const seedRoles = async () => {
    for (const role of roleData) {
      const existingRole = await Role.findOne({ name: role.name });
      if (!existingRole) {
        const newRole = new Role(role);
        await newRole.save();
      }
    }
  };
  seedRoles();
};

export default roleSeeder;
