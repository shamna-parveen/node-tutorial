import employeeSeeder from "./employeeSeeder.js";
import permissionSeeder from "./permissionSeeder.js";

const databaseSeeder = () =>{
    permissionSeeder();
    employeeSeeder();
   
}
export default databaseSeeder;