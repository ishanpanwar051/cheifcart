const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const helmet = require('helmet');
const compression = require('compression');
const { generalLimiter } = require('./middleware/rateLimiter');
const { swaggerUi, specs } = require('./config/swagger');
const UserRoutes=require('./routes/User.route');
const BlogRoutes=require('./routes/Blog.route')
const TestimonialRoutes=require('./routes/Testimonial.route');
const GalleryRoutes=require('./routes/Gallery.route');
const CrouselRoutes=require('./routes/Crousel.route');
const BookingRoutes=require('./routes/Booking.routes');
const chefRoutes=require('./routes/Chef.route');
const Connect=require('./routes/Connect.route')
const ServiceRoutes=require("./routes/Service.route");
const HomeRoutes=require('./routes/HomePage.route');
const InvestorContactRoutes=require('./routes/InvestorContact.route');
const Investor=require('./routes/Investor.route')
const FoodRoutes=require('./routes/Food.route')
const JoinRoutes=require('./routes/Join.route')
const FoodGallRoutes=require('./routes/FoodGall.route')
const adminRoutes = require('./routes/admin.route')
const uploadRoutes = require('./routes/upload.route')
const morgan = require('morgan');

const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Security and optimization middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
    },
  },
}));

// CORS configuration - optimized for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Compression middleware for better performance
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
app.use(generalLimiter);

// Connect to database
if (process.env.MONGODB_URL) {
  connectDB();
} else {
  console.warn('MONGODB_URL is not set. Skipping database connection.');
}


app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
 
// API Routes - organized and deduplicated
app.use('/auth', UserRoutes);
app.use('/blog', BlogRoutes);
app.use('/testimonial', TestimonialRoutes);
app.use('/gallery', GalleryRoutes);
app.use('/crousel', CrouselRoutes);
app.use('/booking', BookingRoutes);
app.use('/connect', Connect);
app.use('/chef', chefRoutes);
app.use('/investor-contact', InvestorContactRoutes);
app.use('/service', ServiceRoutes);
app.use('/home', HomeRoutes);
app.use('/investor', Investor);
app.use('/food', FoodRoutes);
app.use('/join', JoinRoutes);
app.use('/foodgall', FoodGallRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
