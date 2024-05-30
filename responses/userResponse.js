import RoleResponse from './roleResponse.js'

export default class UserResponse {
    /**
     * Transform the employee resource into an object.
     *
     * @param {Object} employee - The employee object to transform.
     * @return {Object} - An object containing selected properties from the employee.
     */
    static async format(employee) {
        return {
            id: employee._id,
            name: employee.name,
            email: employee.email,
            role: employee.role_id
                ? await RoleResponse.format(employee.role_id)
                : null,
        }
    }
}
