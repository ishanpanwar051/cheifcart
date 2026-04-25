const { cloudinary } = require('../config/cloudinary');
const ChefModel = require('../models/Chef.Model');

// Create Chef
const createChef = async (req, res) => {
   try {
       const {
           name,
           Address,
           profilepic, // This should be a Base64 string (with data:image/jpeg;base64,...)
           default_cook_image,
           city,
           state,
           area,
           country,
           pincode,
           email,
           phone,
           experience,
           verified,
           starRating,
           totalRatings,
           language,
           veg,
           nonVeg,
           aboutCook,
           cuisineRatings,
           availableLocations,
           availability,
           housesServed
       } = req.body;

       // ✅ Check required fields
       if (!name || !Address || !city || !state || !area || !country || !pincode || !email || !phone || !experience) {
           return res.status(400).json({ message: "All required fields must be filled" });
       }

       // ✅ Check if chef already exists by email
       const existingChef = await ChefModel.findOne({ email });
       if (existingChef) {
           return res.status(400).json({ message: "Chef already exists" });
       }

      
       // ✅ Create and save the new chef
       const newChef = new ChefModel({
           name,
           Address,
           city,
           state,
           area,
           country,
           pincode,
           email,
           phone,
           experience,
           profilepic,
           default_cook_image,
           verified,
           starRating,
           totalRatings,
           language,
           veg,
           nonVeg,
           aboutCook,
           cuisineRatings,
           availableLocations,
           availability,
           housesServed
       });

       await newChef.save();

       res.status(201).json({
           message: "Chef created successfully",
           data: newChef
       });

   } catch (error) {
       console.error("Error:", error);
       res.status(500).json({ message: "Internal server error" });
   }
};

// Get all chefs with pagination and optimization
const getAllChef = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Optimized query with pagination, lean() for better performance, and field selection
        const chefs = await ChefModel.find()
            .select('name city state starRating profilepic experience verified totalRatings')
            .sort({ starRating: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for read-only operations (faster)

        const total = await ChefModel.countDocuments();

        res.status(200).json({
            message: "Chefs fetched successfully",
            data: chefs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get chef by ID
const getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid chef ID format" });
        }

        const chef = await ChefModel.findById(id).lean(); // Use lean() for better performance
        if (!chef) {
            return res.status(404).json({ message: "Chef not found" });
        }
        res.status(200).json({
            message: "Chef fetched successfully",
            data: chef
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update chef
const updateChef = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            Address,
            profilepic,
            default_cook_image,
            city,
            state,
            area,
            country,
            pincode,
            email,
            phone,
            experience,
            verified,
            starRating,
            totalRatings,
            language,
            veg,
            nonVeg,
            aboutCook,
            cuisineRatings,
            availableLocations,
            availability,
            housesServed
        } = req.body;

        let profilepicUrl = profilepic;
        if (profilepic && profilepic.startsWith("data:")) {
            const uploadResult = await cloudinary.uploader.upload(profilepic, {
                folder: "Chef"
            });
            profilepicUrl = uploadResult.secure_url;
        }

        const updatedChef = await ChefModel.findByIdAndUpdate(
            id,
            {
                name,
                Address,
                city,
                state,
                area,
                country,
                pincode,
                email,
                phone,
                experience,
                profilepic: profilepicUrl,
                default_cook_image,
                verified,
                starRating,
                totalRatings,
                language,
                veg,
                nonVeg,
                aboutCook,
                cuisineRatings,
                availableLocations,
                availability,
                housesServed
            },
            { new: true }
        );

        if (!updatedChef) {
            return res.status(404).json({ message: "Chef not found" });
        }

        res.status(200).json({
            message: "Chef updated successfully",
            data: updatedChef
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete chef by ID
const deleteCheftById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const chef = await ChefModel.findById(id);
        if (!chef) {
            return res.status(404).json({ message: "Chef not found" });
        }

        await ChefModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Chef deleted successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete all chefs
const DeleteAllChef = async (req, res) => {
    try {
        await ChefModel.deleteMany();
        res.status(200).json({
            message: "All chefs deleted successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Search Chefs
const searchChefs = async (req, res) => {
    try {
        const { q, city, cuisine, minRating, page = 1, limit = 10 } = req.query;
        
        // Build search query
        let searchQuery = {};
        
        if (q) {
            searchQuery.$or = [
                { name: { $regex: q, $options: 'i' } },
                { aboutCook: { $regex: q, $options: 'i' } },
                { city: { $regex: q, $options: 'i' } }
            ];
        }
        
        if (city) {
            searchQuery.city = { $regex: city, $options: 'i' };
        }
        
        if (minRating) {
            searchQuery.starRating = { $gte: parseFloat(minRating) };
        }
        
        const skip = (page - 1) * limit;
        
        const chefs = await ChefModel.find(searchQuery)
            .select('name city state starRating profilepic experience cuisineRatings')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ starRating: -1 });
        
        const total = await ChefModel.countDocuments(searchQuery);
        
        res.status(200).json({
            success: true,
            data: chefs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error searching chefs", 
            error: error.message 
        });
    }
};

module.exports = {
    createChef,
    getAllChef,
    getById,
    updateChef,
    deleteCheftById,
    DeleteAllChef,
    searchChefs
};
