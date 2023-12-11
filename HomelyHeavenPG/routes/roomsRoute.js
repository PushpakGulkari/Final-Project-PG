const express= require("express")
const router = express.Router();

const Room= require('../models/room')

router.get("/getallrooms",async(request,response)=>{
    try {
        const rooms = await Room.find({})
        response.send(rooms)
    } catch (error) {
        return response.status(400).json({message:error})
    }
});

router.post("/getroombyid",async(request,response)=>{
    const roomid= request.body.roomid;
    try {
        const room = await Room.findOne({_id : roomid})
        response.send(room)
    } catch (error) {
        return response.status(400).json({message:error})
    }
});

module.exports = router;
