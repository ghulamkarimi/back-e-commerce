"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.userLogin = exports.verifyAccount = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("./sendEmail");
const jwt_decode_1 = require("jwt-decode");
const randombytes_1 = __importDefault(require("randombytes"));
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const userExist = await userModel_1.default.findOne({ email });
    if (userExist) {
        res.status(400).json({ message: 'User already exist' });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Password does not match' });
        return;
    }
    await userModel_1.default.create({
        firstName,
        lastName,
        email,
        password
    });
    const randomVerifyToken = (0, randombytes_1.default)(16).toString('hex');
    const verifyAccountToken = jsonwebtoken_1.default.sign({ email, randomVerifyToken }, process.env.VERIFY_TOKEN_ACCOUNT, //process.env.VERIFY_TOKEN_ACCOUNT as string: Hier wird der Geheimtext oder der private Schlüssel verwendet, um den JWT zu signieren. process.env.VERIFY_TOKEN_ACCOUNT ist eine Umgebungsvariable, die den privaten Schlüssel enthält. Der Schlüssel wird verwendet, um sicherzustellen, dass der Token authentisch ist und nicht manipuliert wurde.
    { expiresIn: '2m' });
    res.cookie('verify_Account', verifyAccountToken, {
        httpOnly: true, //{ httpOnly: true }: Dieser Parameter legt fest, ob das Cookie nur über HTTP-Header gesendet werden soll. Wenn httpOnly auf true gesetzt ist, wird das Cookie nur über HTTP-Header gesendet. Wenn httpOnly auf false gesetzt ist, kann das Cookie auch über JavaScript gelesen werden.
        maxAge: 2 * 60 * 1000,
        secure: false //{ secure: false }: Dieser Parameter legt fest, ob das Cookie nur über eine sichere Verbindung (HTTPS) gesendet werden soll. Wenn secure auf true gesetzt ist, wird das Cookie nur über HTTPS gesendet. Wenn secure auf false gesetzt ist, kann das Cookie auch über eine ungesicherte Verbindung (HTTP) gesendet werden.
    });
    await (0, sendEmail_1.sendVerifyEmail)(email, firstName, randomVerifyToken);
    res.json({
        message: 'You are successfuly registered',
        token: randomVerifyToken
    });
});
exports.verifyAccount = (0, express_async_handler_1.default)(async (req, res) => {
    const { token } = req.params;
    const verifyAccount = req.cookies.verify_Account;
    if (!verifyAccount)
        throw new Error("Invalid link.");
    const decoded = (0, jwt_decode_1.jwtDecode)(verifyAccount);
    const email = decoded.email;
    const randomVerifyToken = decoded.randomVerifyToken;
    console.log("randomVerifyToken", randomVerifyToken);
    if (token !== randomVerifyToken) {
        throw new Error("token ist üngultig");
    }
    const user = await userModel_1.default.findOne({ email });
    if (!user)
        throw new Error("You must register first.");
    user.isVerifyToken = true;
    await user.save();
    res
        .status(200)
        .json({ success: true, message: "Account verified successfully." });
});
exports.userLogin = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const userFound = await userModel_1.default.findOne({ email });
    if (userFound && await (userFound.isPasswordMatched(password))) {
        if (!userFound.isVerifyToken) {
            console.log("verify");
            const randomVerifyToken = (0, randombytes_1.default)(16).toString('hex');
            const verifyToken = jsonwebtoken_1.default.sign({ email, randomVerifyToken }, process.env.VERIFY_TOKEN_ACCOUNT, { expiresIn: '15m' });
            res.cookie('verify_Account', verifyToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
                secure: false
            });
            await (0, sendEmail_1.sendVerifyEmail)(email, userFound.firstName, randomVerifyToken);
            throw new Error('You must verify your account');
        }
        const { _id: userId, firstName, lastName, isVerifyToken, isAdmin } = userFound;
        const accessToken = jsonwebtoken_1.default.sign({ userId, firstName, lastName, isVerifyToken, isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId, firstName, lastName, isVerifyToken, isAdmin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '45s' });
        await userModel_1.default.findByIdAndUpdate(userId, { access_token: accessToken });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false
        });
        const decode = (0, jwt_decode_1.jwtDecode)(refreshToken);
        const userInfo = {
            firstName: decode.firstName,
            lastName: decode.lastName,
        };
        res.json({ message: 'You are successfully logged in', token: refreshToken, userInfo: userInfo });
    }
    else {
        throw new Error('Invalid email or password');
    }
});
exports.logOut = (0, express_async_handler_1.default)(async (req, res) => {
    res.clearCookie('accessToken');
    res.json({ message: 'You are successfully logged out' });
});
//# sourceMappingURL=userController.js.map