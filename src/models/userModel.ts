 import mongoose from "mongoose"
import bcrypt from "bcrypt";

import { IUser } from '../interface/user'


const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerifyToken: {
        type: Boolean,
        default: false

    },
    access_token: {
        type: String,

    },
},
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next:Function) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10); this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.isPasswordMatched = async function (enteredPassword: string) {
    return this.password = await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema);
export default User;