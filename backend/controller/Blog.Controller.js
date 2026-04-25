const { cloudinary } = require("../config/cloudinary");
const Blog = require("../models/Blog.Model");

//create a new blog post with the provided data

const createBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    /// validation process
    if (!title || !content || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // check   if the blog is already exists
    const existingData=await Blog.findOne({title})

    if(existingData){
      return res.status(400).json({message:"This blog already exists"})
    }

    
    const newBlog = new Blog({
      title,
      content,
      category,
      image,
    });
    await newBlog.save();

    res.status(201).json({
      message: "Blog is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all blog posts with pagination and optimization
const getallBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    // Build query
    const query = category ? { category } : {};

    // Optimized query with pagination, lean() for better performance, and field selection
    const blogs = await Blog.find(query)
      .select('title content category image updatedAt createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for read-only operations (faster)

    const total = await Blog.countDocuments(query);

    if (!blogs.length) {
      return res.status(404).json({ 
        message: "No blog posts found",
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
      message: "Blogs fetched successfully",
      data: blogs,
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


//getting a single blog
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    const blog = await Blog.findById(id).lean(); // Use lean() for better performance

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({
      message: "Blog fetched successfully",
      data: blog
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// update all blogs
const updateBlog = async (req, res) => {
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
    const updateBlogs = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        image: imageUrl,
      },
      { new: true }
    );

    if (!updateBlogs) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog  is successfully updated successfully",
      updateBlogs,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete a blog post by id

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
 

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Check if the blog exists before deletion
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog
    const deletedBlog = await Blog.findByIdAndDelete(id);

    res.status(200).json({
      message: "Blog successfully deleted",
      deletedBlog,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createBlog,
    getallBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};