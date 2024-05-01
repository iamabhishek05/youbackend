
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



// middleware for data coming in json format and the limit for it

app.use(express.json({ limit: "50mb" }));

// middleware for data coming from url can be different for different urls so we use url encoded for getting the data from the url in a consistent manner

app.use(express.urlencoded({ extended: false, limit: " 50mb" }))

app.use(express.static("public"))


// cookie parser ka itna sa kaam hai ki mei server se user ka jo broswer hai uski cookies accept bhi kar paau aur set bhi kar paau

app.use(cookieParser())


// routes import 
import router from './routes/user.routes.js'


// routes declaration

app.use('/api/v1/users', router)



export { app } 