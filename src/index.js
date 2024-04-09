
import dotenv from 'dotenv';
import connectDb from './db/index.js';
import express from 'express';


const app = express();

dotenv.config({
    path: './env'
})

// a async method technically returns a promise , so for the db connection we have used async function

connectDb()

    // listening the server , connection of the server till now we have made a connection to the database only
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {

        console.log("MongoDB connection error", err);
    })




