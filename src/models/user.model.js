import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true // whenever you want to make searching make easier on some field then do this 
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true

    },

    avatar: {
        type: String, // URL from cloudinary
        required: true,

    },
    coverImage: {

        type: String, // URL from cloudinary
    },

    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, "password is required"]
    },

    refreshtoken: {
        type: String,
    },


}, { timestamps: true })


// don't directly use callback as an arrow function in pre because in arrow function we do not now the context

// designing the hooks provided by mongoose 
userSchema.pre('save', async function (next) {

    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})



// defining my custom method ( because the users password and my encrypted password should be compared for validity) 

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)
}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )

}

userSchema.methods.genrateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )

}



export const User = mongoose.model('User', userSchema)



