import express from "express"
import useController from "../controller/Auth.js"
const router = express.Router();
router.get('/getUser',useController.getUser);
router.post('/register',useController.register);
router.post('/login',useController.login);
router.put('/user-update/:id',useController.userUpdate);
router.delete('/user-delete/:id',useController.deleteUser);


export default router;