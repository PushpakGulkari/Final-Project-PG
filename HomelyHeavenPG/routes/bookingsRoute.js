const express = require("express");
const router= express.Router();
const Booking = require('../models/booking')
const Room = require('../models/room')
const { v4: uuidv4 } = require('uuid');
const stripe= require('stripe')('sk_test_51OLh0nSJCf6l7vM37RFP4gBKLfV3njyELkWhxRkxHjHYLaijb8D8kFdW0pLd68IIVgUNa7x5tKrKhJhDPbIdZ50W00YO6byxfu')

router.post("/bookroom", async(request,response)=>{
    const {
        room,
        userid,
        fromdate,
        todate,
        totalAmount,
        dateDifference,
        
    } = request.body

   


    try {
        const newbooking = new Booking({
        room : room.name,
        roomid : room._id,
        userid,
        fromdate,
        todate,
        totalAmount,
        dateDifference,
        transactionId : '1234'
        })
        const booking = await newbooking.save();

        const roomtemp = await Room.findOne({_id : room._id});

        roomtemp.currentbookings.push({
            bookingid : booking._id,
            fromdate : fromdate,
            todate : todate,
            userid : userid,
            status : booking.status
        });

        await roomtemp.save()

        response.send('Room Booked Successfully')
    } catch (error) {
        return response.status(400).json({error})
    }
});

router.post("/getbookingsbyuserid", async(request,response)=>{
    const userid = request.body.userid

    try {
        const bookings = await Booking.find({userid : userid})
        response.send(bookings)
    } catch (error) {
        return response.status(400).json({error})
    }
});

// router.post("/cancelbooking", async (request, response) => {
//     const {bookingid} = request.body;
    
//     try {
//         // Check if bookingid and roomid are provided
//         if (!bookingid) {
//             return response.status(400).json({ error: 'Invalid input' });
//         }

//         // Find the booking
//         const bookingitem = await Booking.findOne({ _id: bookingid });

//         // Check if the booking exists
//         if (!bookingitem) {
//             return response.status(404).json({ error: 'Booking not found' });
//         }

//         // Update booking status to "cancelled"
//         bookingitem.status = "cancelled";
//         await bookingitem.save();

//         // Find the room
//         // const myroom = await Room.findOne({ _id: roomid });

//         // Check if the room exists
//         // if (!myroom) {
//         //     return response.status(404).json({ error: 'Room not found' });
//         // }

//         // Filter out the canceled booking from currentbookings
//         // myroom.currentbookings = myroom.currentbookings.filter(bookingroom => bookingroom.bookingid.toString() !== bookingid);

//         // // Save the updated room
//         // await myroom.save();

//         // Respond with success
//         response.send('Booking Cancelled Successfully');
//     } catch (error) {
//         console.error('Error:', error);
//         return response.status(500).json({ error: 'Internal Server Error' });
//     }
// });







// router.post("/cancelbooking", async(request, response)=>{
//     const {bookingid, roomid}=request.body
    
//     try {
//         const bookingitem = await Booking.findOne({ _id : bookingid})
//         console.log(bookingitem)

//         bookingitem.status = "cancelled"
//         await bookingitem.save()
//         const myroom = await Room.findOne({ _id : roomid})

//         const mybookings = myroom.currentbookings
//         const temp = mybookings.filter(bookingroom=>bookingroom.bookingid.toString() !== bookingid)
//         myroom.currentbookings=temp

//         await myroom.save()
//         response.send()
//     } catch (error) {
//         return response.status(400).json({error});
//     }
// });

// router.post("/cancelbooking", async (request, response) => {
//     const { bookingid, roomid } = request.body;
    
//     try {
//         if(!roomid){
//             return response.status(404).json({ error: 'Room not found my bad' });
//         }
//         // Check if bookingid and roomid are provided
//         if (!bookingid || !roomid) {
//             return response.status(400).json({ error: 'Invalid input' });
//         }

//         // Find the booking
//         const bookingitem = await Booking.findOne({ _id: bookingid });

//         // Check if the booking exists
//         if (!bookingitem) {
//             return response.status(404).json({ error: 'Booking not found' });
//         }

//         // Update booking status to "cancelled"
//         bookingitem.status = "cancelled";
//         await bookingitem.save();

//         // Find the room
//         const myroom = await Room.findById({roomid });

//         // Check if the room exists
//         if (!myroom) {
//             return response.status(404).json({ error: 'Room not found my bad' });
//         }

//         // Filter out the canceled booking from currentbookings
//         myroom.currentbookings = myroom.currentbookings.filter(bookingroom => bookingroom.bookingid.toString() !== bookingid);

//         // Save the updated room
//         await myroom.save();

//         // Respond with success
//         response.send('Booking Cancelled Successfully');
//     } catch (error) {
//         console.error('Error:', error);
//         return response.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// router.post("/cancelbooking", async (request, response) => {
//     const { bookingid, roomid } = request.body;
//     try {
//       // Find the booking using the provided bookingid
//       const bookingitem = await Booking.findOne({ _id: bookingid });
  
//       // Update the booking status to "cancelled"
//       bookingitem.status = "cancelled";
//       await bookingitem.save();
  
//       // Find the room using the provided roomid
//       const myroom = await Room.findById(roomid);
  
//       // Get the current bookings for the room
//       const mybookings = myroom.currentbookings;
  
//       // Filter out the canceled booking from currentbookings
//       const temp = mybookings.filter(bookingroom => bookingroom.bookingid.toString() !== bookingid);
  
//       // Update the room's currentbookings with the filtered array
//       myroom.currentbookings = temp;
  
//       // Save the updated room
//       await myroom.save();
  
//       // Send a success response
//       response.send();
//     } catch (error) {
//       // Handle errors and send a 400 status with an error message
//       return response.status(400).json({ error });
//     }
//   });
  


router.post("/cancelbooking", async (request, response) => {
    const { bookingid, roomid } = request.body;

    try {
        const bookingitem = await Booking.findOne({ _id: bookingid });

        if (!bookingitem) {
            return response.status(404).json({ error: 'Booking not found' });
        }

        bookingitem.status = 'cancelled';
        await bookingitem.save();

        if (!roomid) {
            return response.status(400).json({ error: 'Room ID is required' });
        }

        const myroom = await Room.findOne({_id:roomid});

        if (!myroom) {
            return response.status(404).json({ error: 'Room not found' });
        }

        myroom.currentbookings = myroom.currentbookings.filter(bookingroom => bookingroom.bookingid.toString() !== bookingid);
        await myroom.save();

        response.send('Booking Cancelled Successfully');
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router