
export default class RoleResponse {
    /**
     * Transform the role resource into an object.
     *
     * @param {Object} role - The role object to transform.
     * @return {Object} - An object containing selected properties from the role.
     */
    static async format(role) {
        return {
            id: role._id,
            name: role.name,
            description: role.description,
            permissions: role.permissions,
        }
    }
}
