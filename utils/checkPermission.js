import Role from "../models/role.js";

const checkPermissions = async (user, requiredPermission) => {
  if (user) {
    try {
      const role = await Role.findOne({ _id: user.role_id });
      if (role) {
        if (role.name === 'Super Admin') {
          return true; // Super Admin has all permissions
        }
        else{
          return role.permissions.includes(requiredPermission);
        }
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
  return false;
};

export default checkPermissions;
