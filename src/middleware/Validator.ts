import { Request, Response, NextFunction } from 'express';
import { body, validationResult} from 'express-validator';
 
export const validatorCreateUser = [
    body("firstName").isAlpha().isLength({ min: 3 }).withMessage("First name must be at least 3 characters"),

    body("lastName").isAlpha().isLength({ min: 3 }).withMessage("Last name must be at least 3 characters"),

    body("email").isEmail().withMessage("Please enter a valid email"),

    body("password").isLength({ min: 6 }).matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage("Password must be at least 6 characters, and contain at least one letter, one number and one special character"),


    // check for errors
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]
