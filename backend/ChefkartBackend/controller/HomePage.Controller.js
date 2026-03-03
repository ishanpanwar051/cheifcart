const { cloudinary } = require("../config/cloudinary");
const Home = require("../models/HomeImage.Model");

//create a new blog post with the provided data

const createKitchen = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    /// validation process
    if (!title || !content || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // check   if the blog is already exists
    const existingData=await Home.findOne({title})

    if(existingData){
      return res.status(400).json({message:"This blog already exists"})
    }

    
    const newHome = new Home({
      title,
      content,
      category,
      image,
    });
    await newHome.save();

    res.status(201).json({
      message: "Home Page is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all home images with pagination and optimization
const getallHomeImage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    // Build query
    const query = category ? { category } : {};

    // Optimized query with pagination, lean() for better performance, and field selection
    const Homes = await Home.find(query)
      .select('title content category image updatedAt createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for read-only operations (faster)

    const total = await Home.countDocuments(query);

    if (!Homes.length) {
      return res.status(404).json({ 
        message: "No Home posts found",
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
      message: "Home images fetched successfully",
      data: Homes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


//getting a single home image
const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid home ID format" });
    }

    const home = await Home.findById(id).lean(); // Use lean() for better performance

    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }
    res.status(200).json({
      message: "Home fetched successfully",
      data: home
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// update all blogs
const updateHomePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, image } = req.body;
    let imageUrl = "";
    //image uploading process
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }
    const updatedhome = await Home.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        image: imageUrl,
      },
      { new: true }
    );

    if (!updatedhome) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "homePage  is successfully updated successfully",
      updatedhome,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete a blog post by id

const deletehomePage = async (req, res) => {
  try {
    const { id } = req.params;
 

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Check if the blog exists before deletion
    const existingHome = await Home.findById(id);
    if (!existingHome) {
      return res.status(404).json({ message: "Home not found" });
    }

    // Delete the blog
    const deletedHome = await Home.findByIdAndDelete(id);

    res.status(200).json({
      message: "Home successfully deleted",
      deletedHome,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createKitchen,
    getallHomeImage,
    getHomeById,
    updateHomePage,
    deletehomePage
};