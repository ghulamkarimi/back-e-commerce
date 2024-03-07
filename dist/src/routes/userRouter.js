"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const Validator_1 = require("../middleware/Validator");
const router = (0, express_1.default)();
router.post('/api/register', Validator_1.validatorCreateUser, userController_1.registerUser);
router.get('/api/verify_token/:token', userController_1.verifyAccount);
router.post('/api/login', userController_1.userLogin);
router.delete('/api/logout/:token', userController_1.logOut);
exports.default = router;
//# sourceMappingURL=userRouter.js.map