import express from "express";
import router from "./router";
import database from "./config/db";

// Connect to the database
async function connect() {
    try {
        await database.authenticate();
        database.sync();
        console.log("Connection to the database has been established successfully.");
    } catch (error) {
        console.error("Error connecting to the database: ", error);   
    }
}

connect();
const server = express();

server.use('/api', router);

export default server;