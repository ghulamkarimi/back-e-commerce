"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorCreateUser = void 0;
const express_validator_1 = require("express-validator");
exports.validatorCreateUser = [
    (0, express_validator_1.body)("firstName").isAlpha().isLength({ min: 3 }).withMessage("First name must be at least 3 characters"),
    (0, express_validator_1.body)("lastName").isAlpha().isLength({ min: 3 }).withMessage("Last name must be at least 3 characters"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("password").isLength({ min: 6 }).matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage("Password must be at least 6 characters, and contain at least one letter, one number and one special character"),
    // check for errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
//# sourceMappingURL=Validator.js.map