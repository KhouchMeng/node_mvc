import db from "../db/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const getUser = async (req, res) => {
    try {
        db.query("SELECT * FROM users", (error, results) => {
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ message: "Error fetching data", error });
            }
            res.status(200).json({ data: results, message: "Data fetched successfully" });
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
};
const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Check if the email or username already exists
        db.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username], async (error, results) => {
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ message: "Error checking user existence", error });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "Username or email already exists" });
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert the new user
            db.query(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                [username, email, hashedPassword],
                (error, results) => {
                    if (error) {
                        console.error("Database insertion error:", error);
                        return res.status(500).json({ message: "Error registering user", error });
                    }

                    res.status(201).json({ message: "User registered successfully" });
                }
            );
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    
    try {
        db.query("SELECT * FROM users WHERE email = ? ", [email], async (error, results) => {
            if (error) {
                console.error("Database query error:", error);
                return res.status(500).json({ message: "Error checking user", error });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const user = results[0];

            // Verify the password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Generate a JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.status(200).json({ message: "Login successful", token });
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
};

const userUpdate = async (req, res) => {
    const id = req.params.id; // User ID
    const { username, email, password } = req.body;

    if (!id || !username || !email ||  !password ) {
        return res.status(400).json({ message: "ID, current password, and new password are required" });
    }

    try {
        
            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Update the password in the database
            db.query(
                "UPDATE users SET username = ?,email = ?, password = ? WHERE id = ?",
                [username,email,hashedPassword, id],
                (error, result) => {
                    if (error) {
                        console.error("Database update error:", error);
                        return res.status(500).json({ message: "Error updating password", error });
                    }

                    if (result.affectedRows > 0) {
                        res.status(200).json({ message: "Password updated successfully" });
                    } else {
                        res.status(404).json({ message: "User not found" });
                    }
            });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
};

const deleteUser = async (req,res) =>{
    const id = req.params.id
    const sql = "DELETE FROM users WHERE id = ?";
    try{
        db.query(sql,[id],(error,result)=>{
            if(result){
                res.status(200).json({ data : result , message : 'delete user success'});
            }else{
                res.status(404).json({message :'user not found'});
            }
        })
    }catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ message: "Unexpected server error", error: err });
    }
}


export default {
    getUser,
    register,
    login,
    userUpdate,
    deleteUser
};
