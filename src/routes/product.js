import express from "express"
import useController from "../controller/product.js"
const router = express.Router();
router.get('/get-product',useController.getProduct);
router.post('/post-product',useController.postProduct);
router.put('/update-product/:id',useController.updateProduct);
router.delete('/delete-product/:id',useController.deleteProduct);
export default router;