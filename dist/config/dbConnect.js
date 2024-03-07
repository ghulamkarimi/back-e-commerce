"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = dbConnect;
//# sourceMappingURL=dbConnect.js.map