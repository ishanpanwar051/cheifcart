const Booking=require('../models/Booking.Model');


// create bOoking 

const createBooking = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }

        const { chef, bookingDate, status, notes } = req.body;

        // Create a new booking
        const newBooking = new Booking({
            user: req.user.userId,  // Use authenticated user's ID
            chef,
            bookingDate,
            status,
            notes
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getBookings = async(req,res)=>{
     try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const userId = req.query.userId;
        const chefId = req.query.chefId;

        // Build query
        const query = {};
        if (userId) query.user = userId;
        if (chefId) query.chef = chefId;

        // Optimized query with pagination and population
        const Bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate('chef', 'name city profilepic')
            .sort({ bookingDate: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            message:"Bookings fetched successfully",
            data: Bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
     }
     catch(error){
         console.error(error);
         res.status(500).json({message:"Internal server error"});
     }
}

// we need a single booking
const getBookingById=async(req,res)=>{
     try{
        const {id}=req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid booking ID format" });
        }

        const booking = await Booking.findById(id)
            .populate('user', 'name email phone')
            .populate('chef', 'name city state profilepic email phone')
            .lean();

        if(!booking){
            return res.status(404).json({message:"Booking not found"});
        }

         res.status(200).json({
            message:"Booking fetched successfully",
            data: booking
         })
     }
     catch(error){
        console.error("Error:",error);
         res.status(500).json({message:"Internal server error"});
     }
}


const updateBooking =async(req,res)=>{
    try{
         const {id}=req.params;
         const{chef, bookingDate, status, notes } =req.body;

         // Validate ObjectId format
         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid booking ID format" });
         }

         const updatedBooking=await Booking.findByIdAndUpdate(id,{
            chef,bookingDate,status,notes
         },
        {new:true, runValidators: true});

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({
            message:"Booking updated Successfully",
            data:updatedBooking
        })

    }
    catch(error){
        console.error("Error:",error);
        res.status(500).json({
            message: "Internal server error",
          });
    }
}



const deleteBooking = async (req, res) => {
    try {
      const bookings=await Booking.deleteMany();
     
  
      res.status(200).json({
        message: "Booking  deleted successfully",
      data: bookings
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports={createBooking,getBookings,getBookingById,updateBooking ,
    deleteBooking  
};