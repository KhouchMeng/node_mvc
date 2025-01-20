import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const connection =  mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
});
if(connection){
    console.log('connection Success');
}else{
    console.log('not connection')
}
export default connection;
