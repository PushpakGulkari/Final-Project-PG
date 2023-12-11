const express= require("express")
const router = express.Router();

const User= require('../models/user')

router.post("/register", async(request,response)=>{
    const newuser= new User({name:request.body.name, email:request.body.email, password: request.body.password})
    try {
        const user = await newuser.save()
        response.send('User Registration Successfully')
    } catch (error) {
        return response.status(400).json({error})
    }
});

router.post("/login",async(request,response)=>{
    const{email,password}=request.body
    try {
        const user =await User.findOne({email : email , password : password})
        if (user) {
            const temp ={
                name : user.name,
                email : user.email,
                isAdmin : user.isAdmin,
                _id : user._id
            }
            response.send(temp)   
        } else {
            return response.status(400).json({message:'Login Failed'})
        }
    } catch (error) {
        return response.status(400).json({error})
    }
});

module.exports=router;
