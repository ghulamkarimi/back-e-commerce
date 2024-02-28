import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import User from '../models/userModel';
import Jwt from 'jsonwebtoken';
import { sendVerifyEmail } from './sendEmail';
import { IUser } from '../interface/user';
import { jwtDecode } from 'jwt-decode';
import randomBytes from 'randombytes';




export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400).json({ message: 'User already exist' })
        return
    }
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Password does not match' })
        return
    }
    await User.create({
        firstName,
        lastName,
        email,
        password
    })
    const verifyAccountToken = Jwt.sign(
        { email },
        process.env.VERIFY_TOKEN_ACCOUNT as string,//process.env.VERIFY_TOKEN_ACCOUNT as string: Hier wird der Geheimtext oder der private Schlüssel verwendet, um den JWT zu signieren. process.env.VERIFY_TOKEN_ACCOUNT ist eine Umgebungsvariable, die den privaten Schlüssel enthält. Der Schlüssel wird verwendet, um sicherzustellen, dass der Token authentisch ist und nicht manipuliert wurde.
        { expiresIn: '2m' }
    );
    res.cookie('verify_Account', verifyAccountToken, {
        httpOnly: true,//{ httpOnly: true }: Dieser Parameter legt fest, ob das Cookie nur über HTTP-Header gesendet werden soll. Wenn httpOnly auf true gesetzt ist, wird das Cookie nur über HTTP-Header gesendet. Wenn httpOnly auf false gesetzt ist, kann das Cookie auch über JavaScript gelesen werden.
        maxAge: 2 * 60 * 1000,
        secure: false //{ secure: false }: Dieser Parameter legt fest, ob das Cookie nur über eine sichere Verbindung (HTTPS) gesendet werden soll. Wenn secure auf true gesetzt ist, wird das Cookie nur über HTTPS gesendet. Wenn secure auf false gesetzt ist, kann das Cookie auch über eine ungesicherte Verbindung (HTTP) gesendet werden.

    })
    await sendVerifyEmail(email, firstName, verifyAccountToken)
    res.json({ message: 'You are successfuly registered' })
})

export const verifyAccount = asyncHandler(async (req: Request, res: Response) => {
    const {token} = req.params;
    const verify_token = req.cookies.verify_Account;
    console.log(token);

    try {
        if (!token||verify_token !== token) {
            throw new Error("Invalid token and ...");
        }
        const decode = jwtDecode<IUser>(token);
        const email = decode.email;
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid token');
        user.verify_token = true;
        await user.save();
        res.json({ message: 'Account verified successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export const userLogin = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (userFound && (await userFound.isPasswordMatch(password))) {
        if (!userFound.verify_token) {
            const randomVerifyToken = randomBytes(16).toString('hex');
            const verifyToken = Jwt.sign(
                { email, randomVerifyToken },
                process.env.VERIFY_TOKEN_ACCOUNT as string,
                { expiresIn: '15m' }
            )
            res.cookie('verify_Account', verifyToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
                secure: false
            })
            await sendVerifyEmail(email, userFound.firstName, randomVerifyToken);
            res.json({ message: 'Please verify your account' })
        }
        const { _id: userId, firstName, lastName, verify_token, isAdmin } = userFound;
        const accessToken = Jwt.sign({ userId, firstName, lastName, verify_token, isAdmin },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '1d' })

        const refreshToken = Jwt.sign({ userId, firstName, lastName, verify_token, isAdmin },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '45s' }
        )
        await User.findByIdAndUpdate(userId, { access_token: accessToken })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false
        })

        const decode = jwtDecode<IUser>(refreshToken)
        const userInfo = {
            firstName: decode.firstName,
            lastName: decode.lastName,
        }
        res.json({ message: 'You are successfully logged in', token: refreshToken, userInfo: userInfo })
    } else {
        throw new Error('Invalid email or password')
    }

})


export const logOut = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.json({ message: 'You are successfully logged out' })
})













