"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifyEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: "karimiamirhossein12@gmail.com",
        pass: process.env.PASSWORD
        //      pass: "qiai nvqk dyyo wpbp"
    }
});
const sendVerifyEmail = async (email, firstName, verifyToken) => {
    try {
        const mailOptions = {
            from: 'karimiamirhosein12gmail.com',
            to: email,
            subject: 'Verify Email',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <p>Dear ${firstName},</p>
                    <h1 style="color: #333;">Click the link below to verify your account</h1>
                    <img src='https://th.bing.com/th/id/OIP.cneIxMB7ie6Q1JkJoLB5zwHaE2?w=279&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7' alt='brand' width='40' height='40' />
                    <p style="color: #666;">Please click the link below to verify your account:</p>
                    <a href="http://localhost:3600/verify?token=${verifyToken}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Account</a>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
exports.sendVerifyEmail = sendVerifyEmail;
//# sourceMappingURL=sendEmail.js.map