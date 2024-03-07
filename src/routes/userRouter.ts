import Router from 'express';
import { logOut, registerUser, userLogin, verifyAccount } from '../controllers/userController';
import { validatorCreateUser } from '../middleware/Validator';

const router = Router();

router.post('/api/register',validatorCreateUser ,registerUser);
router.get('/api/verify_token/:token', verifyAccount)
router.post('/api/login', userLogin);
router.delete('/api/logout/:token' , logOut)


export default router;