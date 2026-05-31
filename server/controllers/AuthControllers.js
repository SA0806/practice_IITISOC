// AuthController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js'; // Add .js extension in ESM

export const signup = async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        console.log("Checking if user exists...");

        if (user) {
            console.log("User already exists");
            return res.status(409).json({ message: 'User already exists', success: false });
        }

        console.log("Creating new user...");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });

        await newUser.save();
        console.log("User saved to database");

        res.status(201).json({ message: "Signup successful", success: true });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// export const login = async (req, res) => {
//     try {

//         console.log("Login request received:", req.body);

//         const { email, password } = req.body;
//         const user = await UserModel.findOne({ email });
//         const errorMsg = 'Auth failed email or password is wrong';

//         if (!user) {
//             return res.status(403).json({ message: errorMsg, success: false });
//         }

//         const isPassEqual = await bcrypt.compare(password, user.password);
//         if (!isPassEqual) {
//             return res.status(403).json({ message: errorMsg, success: false });
//         }

//         const jwtToken = jwt.sign(
//             { email: user.email, _id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         res.status(200).json({
//             message: "Login Success",
//             success: true,
//             jwtToken,
//             email,
//             name: user.name
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

export const login = async (req, res) => {
    try {
        console.log("Login request received:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await UserModel.findOne({ email });
        console.log("User found?", !!user);

        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            console.log("User not found");
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        console.log("Password match?", isPassEqual);

        
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        if (!process.env.JWT_SECRET) {
            console.log("Missing JWT_SECRET");
            return res.status(500).json({ message: "JWT_SECRET not configured", success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("JWT generated");

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
