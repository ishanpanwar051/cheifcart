const { cloudinary } = require("../config/cloudinary");
const Testimonial = require("../models/Testimonial.Model");

/// create a testimonial
const createTestimonial = async (req, res) => {
  try {
    const { name, content, profileimage } = req.body;

    if (!name || !content) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const newTestimonial = new Testimonial({
      name,
      content,
      profileimage,
    });
    await newTestimonial.save();

    res.status(201).json({
      message: "Testimonial is successfully created",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//get all Testimonials with pagination and optimization

const getAllTestimonial=async(req,res)=>{
     try{
         const page = parseInt(req.query.page) || 1;
         const limit = parseInt(req.query.limit) || 10;
         const skip = (page - 1) * limit;

         // Optimized query with pagination, lean() for better performance
         const Testimonials = await Testimonial.find()
             .select('name content profileimage createdAt')
             .sort({ createdAt: -1 })
             .skip(skip)
             .limit(limit)
             .lean(); // Use lean() for read-only operations (faster)

         const total = await Testimonial.countDocuments();
         
         if(!Testimonials.length){
             return res.status(404).json({
                 message:"No Testimonial found",
                 data: [],
                 pagination: {
                     page,
                     limit,
                     total: 0,
                     pages: 0
                 }
             });
         }
          res.status(200).json({
             message:"Testimonials fetched successfully",
             data: Testimonials,
             pagination: {
                 page,
                 limit,
                 total,
                 pages: Math.ceil(total / limit)
             }
          })
     }
     catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
     }
}

//get a single testimonial
 const getTestimonialByID=async(req,res)=>{
     try{
          const {id}=req.params;

          // Validate ObjectId format
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid testimonial ID format" });
          }

          const testimonial = await Testimonial.findById(id).lean(); // Use lean() for better performance

          if(!testimonial){
            return res.status(404).json({message:"Testimonial not found"});
          }
          res.status(200).json({
             message:"Testimonial Fetched Successfully",
             data: testimonial
          })
     }catch(error){
         console.error("Error:",error);
           res.status(500).json({message:"Internal server error"})
     }
 }

//update testimonial
const updateTestimonial=async(req,res)=>{
     try{
         const {id}=req.params;

          const { name, content, profileimage}=req.body;
          
          let imageUrl="";

           if(profileimage){
             const result=await cloudinary.uploader.upload(profileimage,{
               folder:"testimonials",
             });
             imageUrl=result.secure_url;
           }
            const updateTestimonial=await Testimonial.findByIdAndUpdate(id,{
                 name, 
                 content,
                 profileimage:imageUrl
            },{new:true},)
            

            if(!updateTestimonial){
               return res.status(404).json({message:"Testimonial not found"});
            }
             res.status(200).json({
                message:"Testimonial updated successfully",
                data:updateTestimonial
             });

     }
     catch(error){
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
     }
}


const deleteTestomonial=async(req,res)=>{
    try{
        const {id}=req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid blog ID format" });
          }
         
          const existingTestimonial=await Testimonial.findById(id); 
          if(!existingTestimonial){
            return res.status(404).json({message:"Testimonial not found"});
          }
           // delete the testimonial
            const deleteTestimonial=await Testimonial.findByIdAndDelete(id);

            res.status(200).json({
                message:"Testimonial Deleted Successfully",
                data:deleteTestimonial
            });

    }
    catch(error){
       console.error("Error:", error);
       res.status(500).json({ message: "Internal server error" });
    }
}


module.exports={
    createTestimonial,
    getAllTestimonial,
    getTestimonialByID,
    updateTestimonial,
    deleteTestomonial
    
};