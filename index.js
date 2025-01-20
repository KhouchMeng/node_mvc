import express from "express"
import dotenv from "dotenv"
import userRoutes from "./src/routes/Auth.js"
import useProduct from "./src/routes/product.js"
const app = express()
dotenv.config();
app.use(express.json())

app.use('/api/users',userRoutes)
app.use('/api/product',useProduct)


const PORT = process.env.PORT || 8009
app.listen(PORT,()=>{
    console.log('server running...');
})
