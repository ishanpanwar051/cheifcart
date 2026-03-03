# Cloudinary Setup Guide for Chefkart

## Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Credentials
1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Find your credentials in the dashboard:
   - **Cloud name** (displayed at the top)
   - **API Key** (click "Account Details" → "Security")
   - **API Secret** (click "Account Details" → "Security")

## Step 3: Update Environment Variables
Update your `.env` file in `backend/ChefkartBackend/`:

```env
MONGODB_URL=mongodb://localhost:27017/chefkart
PORT=3000
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Test the Setup
1. Restart your backend server
2. Test image upload using these endpoints:

### Upload Endpoints:
- **Single Image**: `POST /upload/single`
- **Multiple Images**: `POST /upload/multiple`
- **Base64 Image**: `POST /upload/base64`
- **Delete Image**: `DELETE /upload/delete`

### Example Usage:
```javascript
// Upload single image
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/upload/single', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## Step 5: Frontend Integration
Use the `ImageUpload` component in your React components:

```jsx
import ImageUpload from './components/common/ImageUpload';

function MyComponent() {
  const handleImageUpload = (imageData) => {
    console.log('Image uploaded:', imageData);
    // imageData.url contains the Cloudinary URL
    // imageData.public_id contains the Cloudinary public ID
  };

  return (
    <ImageUpload 
      onImageUpload={handleImageUpload}
      multiple={true}
      maxFiles={5}
    />
  );
}
```

## Features Available:
✅ Single image upload
✅ Multiple image upload
✅ Base64 image upload
✅ Image deletion
✅ File size validation (5MB limit)
✅ File type validation (images only)
✅ Preview functionality
✅ Error handling

## Image Transformations:
You can transform images using Cloudinary URLs:

```javascript
// Get resized image
const imageUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/w_300,h_300,c_fill/${public_id}`;

// Get optimized image
const optimizedUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/q_auto/${public_id}`;
```

## Troubleshooting:
1. **"Invalid credentials"**: Check your Cloudinary credentials
2. **"File too large"**: Files must be under 5MB
3. **"Invalid file type"**: Only image files are allowed
4. **"Upload failed"**: Check your internet connection and Cloudinary status

## Next Steps:
1. Add image upload to chef registration
2. Add image gallery for food items
3. Add profile picture upload for users
4. Implement image optimization

Your images will now be stored in Cloudinary and served via CDN! 🚀
