import db from "../db/db.config.js"
const getProduct = async (req,res) =>{
    try{
        db.query("SELECT * FROM product ORDER BY product_id DESC",(error,result) =>{
            if(result){
                res.status(200).json({data : result, message : 'Successfuly'});
            }else{
                res.status(404).json({error :'product data error'});
            }
        })
    }catch(err){
        res.status(404).json({err : 'fetch data error'});
    }
}
const postProduct = async (req,res) =>{
    const {product_name,size,price,qty,description} = req.body
    try{
        const sql = "INSERT INTO product (`product_name`,`size`,`price`,`qty`,`description`) VALUE (?,?,?,?,?)";
        db.query(sql,[product_name,size,price,qty,description],(error,result)=>{
            if(result){
                res.status(200).json({data : result , message :'insert product successfuly'});
            }else{
                res.status(404).json({error :'product data error'});
            }
        })
    }catch(err){
        res.status(404).json({err : 'fetch data error'})
    }
}

const updateProduct = async (req, res) => {
    const id = req.params.id; // Product ID from the URL
    const { product_name, size, price, qty, description } = req.body; // Fields to update

    if (!id || !product_name || !size || !price || !qty || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const sql = `
            UPDATE product 
            SET product_name = ?, size = ?, price = ?, qty = ?, description = ? 
            WHERE product_id = ?
        `;

        db.query(sql, [product_name, size, price, qty, description, id], (error, result) => {
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ message: "Error updating product", error });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ data: result, message: "Product updated successfully" });
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
};

// delete product
const deleteProduct = async (req,res) =>{
    const id = req.params.id
    try{
        const sql = "DELETE FROM product WHERE product_id = ?";
        db.query(sql,[id],(error,result)=>{
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ message: "Error updating product", error });
            }
            res.status(200).json({data : result ,message :'delete product successfuly'});
        })
    }catch(err){
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
}

export default {
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,
}