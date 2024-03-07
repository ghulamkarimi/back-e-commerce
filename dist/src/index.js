"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const ErrorHandler_1 = require("./middleware/ErrorHandler");
dotenv_1.default.config();
(0, dbConnect_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3600;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(userRouter_1.default);
app.use(ErrorHandler_1.notFound);
app.use(ErrorHandler_1.ErrorHandler);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//# sourceMappingURL=index.js.map