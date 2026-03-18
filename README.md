# Doctor Appointment System

A comprehensive doctor appointment booking system built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform connects patients with certified healthcare professionals, enabling seamless appointment booking, online consultations, and health management.

## 🚀 Features

### Core Functionality
- **User Authentication System** - Secure registration and login with JWT tokens
- **Doctor Management** - Verified doctor profiles with specializations and availability
- **Appointment Booking** - Real-time slot availability and booking system
- **Payment Integration** - Secure online payments via Razorpay
- **Review & Rating System** - Patient feedback and doctor ratings
- **Real-time Chat** - Patient-doctor communication via Socket.io
- **Notification System** - Email and in-app notifications
- **Disease Database** - 150+ diseases with doctor matching
- **Blog System** - Health articles and medical insights
- **Multi-role Dashboard** - Separate dashboards for users, doctors, and admins

### Advanced Features
- **File Upload** - Profile pictures and medical documents
- **Analytics & Reporting** - Comprehensive statistics and insights
- **Search & Filtering** - Advanced doctor search with multiple filters
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Security Features** - Input validation, rate limiting, CORS protection
- **Role-based Access Control** - Different permissions for users, doctors, and admins

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Razorpay** - Payment processing
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage
- **Nodemailer** - Email services

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **React Query** - Data fetching and caching
- **React Hot Toast** - Notification system
- **Chart.js** - Data visualization

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
doctor-appointment-system/
├── server/                     # Backend application
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   ├── Disease.js
│   │   ├── Blog.js
│   │   └── Notification.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── payments.js
│   │   ├── reviews.js
│   │   ├── diseases.js
│   │   ├── blogs.js
│   │   ├── notifications.js
│   │   └── chat.js
│   ├── middleware/             # Express middleware
│   │   └── auth.js
│   └── index.js               # Server entry point
├── client/                     # Frontend application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── layout/        # Layout components
│   │   │   └── auth/          # Authentication components
│   │   ├── contexts/          # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── public/        # Public pages
│   │   │   ├── user/          # User dashboard
│   │   │   ├── doctor/        # Doctor dashboard
│   │   │   ├── admin/         # Admin dashboard
│   │   │   └── error/         # Error pages
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # App entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .env                       # Environment variables
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doctor-appointment-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env file and update with your credentials
   cp .env.example .env
   ```

4. **Update environment variables**
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/doctor-appointment-system

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the development servers**
   ```bash
   # Start both backend and frontend concurrently
   npm run dev
   
   # Or start them separately
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Doctor Endpoints
- `GET /api/doctors` - Get all doctors with filters
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors/register` - Register as doctor
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/my-appointments` - Get doctor's appointments

### Appointment Endpoints
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/available-slots/:doctorId/:date` - Get available slots

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

## 🎯 Usage Examples

### Booking an Appointment
```javascript
// 1. Search for doctors
const doctors = await doctorService.getAllDoctors({
  specialization: 'Cardiologist',
  city: 'Mumbai'
});

// 2. Get available slots
const slots = await doctorService.getAvailableSlots(doctorId, '2024-01-15');

// 3. Book appointment
const appointment = await appointmentService.bookAppointment({
  doctorId,
  date: '2024-01-15',
  time: '10:00',
  disease: 'Chest Pain'
});
```

### Processing Payment
```javascript
// 1. Create Razorpay order
const order = await paymentService.createOrder({
  appointmentId: 'appointment_id',
  amount: 500
});

// 2. Initialize Razorpay checkout
const razorpay = new Razorpay({
  key_id: order.keyId,
  key_secret: 'your_secret'
});

// 3. Handle payment success
const payment = await paymentService.verifyPayment({
  razorpayOrderId: order.orderId,
  razorpayPaymentId: paymentId,
  razorpaySignature: signature
});
```

## 🔧 Configuration

### Database Setup
1. Install MongoDB locally or create a MongoDB Atlas account
2. Update `MONGODB_URI` in your `.env` file
3. The application will automatically create collections on first run

### Email Setup
1. For Gmail, enable 2-factor authentication
2. Generate an app password
3. Update email credentials in `.env` file

### Payment Setup
1. Create a Razorpay account
2. Get your API keys from Razorpay dashboard
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`

### File Upload Setup
1. Create a Cloudinary account
2. Update Cloudinary credentials in `.env` file
3. Configure upload presets in Cloudinary dashboard

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-production-db-uri
heroku config:set JWT_SECRET=your-production-secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [FAQ](#faq) section
2. Search existing [Issues](../../issues)
3. Create a new issue with detailed information
4. Contact support at support@doccare.com

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Razorpay](https://razorpay.com/) for payment processing
- [MongoDB](https://www.mongodb.com/) for the database
- [React](https://reactjs.org/) for the frontend framework

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added real-time chat and notifications
- **v1.2.0** - Enhanced admin dashboard and analytics
- **v1.3.0** - Mobile app integration and telemedicine features

---

**Built with ❤️ for better healthcare accessibility**
