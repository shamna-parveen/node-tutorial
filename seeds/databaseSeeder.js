import employeeSeeder from "./employeeSeeder.js";
import permissionSeeder from "./permissionSeeder.js";
import seedRoles from "./roleSeeder.js";
const databaseSeeder = () =>{
    permissionSeeder();
    seedRoles();
    employeeSeeder();
   
}
export default databaseSeeder;