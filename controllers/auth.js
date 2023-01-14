const User = require("../models/user.js");
const { hashPassword } = require("../helpers/auth.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();



exports.register = async(req,res)=>{
    try {
        const { name, email, password} = req.body;
        console.log(`${name} ${email} ${password}`);

        if(!name.trim()){
            return res.json({error: "Name is required"})
        }
        if(!email){
            return res.json({error: "Email is required"})
        }
        if(!password || password.length <6){
            return res.json({error: "Password must be at least 6 character long"})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({error: "Email is already register"})
        }

        const hashePassword = await hashPassword(password);

        const user = await new User({
            name,
            email,
            password:hashePassword,
        }).save();

        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn: "7d", 
        });

        res.json({
            user: {
                name:  user.name,
                email: user.email,
                role:  user.role,
                address:user.address,
            },
            token,
        });

    } catch (err) {
        console.log(err);
    }
};