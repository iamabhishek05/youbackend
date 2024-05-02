import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js'
import { uploadonCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';


const registerUser = asyncHandler(async (req, res) => {


    // Get user details from frontend : done 
    // Validation - not empty : done 
    // check if user already exists : username , email : done
    // check for images , check for avatar
    // upload to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res 


    const { fullname, email, username, password } = req.body;

    // if there is a field then trim it and after trim it is empty then return true 
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")

    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User already exists with this username and email")
    }


    const avatarLocalpath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalpath) {
        throw new apiError(400, "Avatar is required")
    }

    const avatar = await uploadonCloudinary(avatarLocalpath)
    // const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        // coverImage: coverImage?.url || "", 
        email,
        username: username.toLowerCase(),
        password
    })


    // const createdUser = await User.findById(user._id).select(
    //     "-password -refreshToken"
    // )
    const createdUser = await User.findById(user._id);




    if (createdUser) {
        delete user.password;
    } else {
        throw new apiError(500, "User not created")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )


})

export { registerUser } 