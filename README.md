# Elite Motors - Premium Car Dealership

A modern, feature-rich car dealership web application built with React, TypeScript, and Tailwind CSS. Elite Motors provides an exceptional user experience for browsing luxury vehicles, scheduling test drives, and managing the complete car buying journey.

## 🚗 About the Project

Elite Motors is a comprehensive car dealership platform that showcases premium and luxury vehicles with an elegant, professional interface. The application features an interactive guided tour, responsive design, and a seamless booking flow from vehicle selection to confirmation.

## ✨ Key Features

### Customer-Facing Features
- **🏠 Landing Page**: Stunning hero section with animated elements, featured vehicles, customer testimonials, and brand showcase
- **🚙 Vehicle Catalog**: Browse a curated collection of luxury electric vehicles with detailed specifications
- **🔍 Car Details**: Comprehensive vehicle information including specs, features, image galleries, and pricing
- **📦 Package Selection**: Choose from multiple service packages (Basic, Premium, Ultimate) for test drives and purchases
- **📅 Booking System**: Complete booking flow with personal information, date/time selection, and payment processing
- **✅ Confirmation**: Detailed booking confirmation with summary and next steps
- **🏆 Recently Sold**: Showcase of recently sold vehicles to build trust and credibility
- **ℹ️ About Page**: Company information, mission, and values
- **📞 Contact Page**: Contact form and dealership information
- **🎯 Interactive Tour**: Guided walkthrough using React Joyride to help users navigate the platform

### Admin Features
- **🔐 Admin Login**: Secure authentication for administrative access
- **👤 Admin Creation**: Two-step admin registration with OTP verification

### UI/UX Features
- **🎨 Modern Design**: Professional color scheme with sky blue primary, teal accents, and clean typography
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🌙 Theme Support**: Built-in dark/light mode support with next-themes
- **✨ Animations**: Smooth transitions and micro-interactions using Framer Motion
- **🎭 Premium Components**: Extensive use of shadcn/ui components for consistent design
- **🔔 Toast Notifications**: User feedback with Sonner toast notifications

## 🛠️ Tech Stack

### Core Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 5.4.19** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion 12.23.24** - Animation library
- **Lucide React** - Beautiful icon library

### Routing & State Management
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack Query 5.83.0** - Server state management
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation

### Additional Libraries
- **React Joyride 2.9.3** - Interactive product tours
- **date-fns 3.6.0** - Date manipulation
- **Recharts 2.15.4** - Charting library
- **Embla Carousel** - Carousel component
- **next-themes** - Theme management

### Development Tools
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **@vitejs/plugin-react-swc** - Fast React refresh

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Vinaypenke01/Elite-Cars-UI.git
cd Elite-Cars-UI
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable the following services:
   - **Authentication** (Email/Password provider)
   - **Firestore Database**
   - **Storage** (optional, for car images)
   - **Analytics** (optional)

#### Configure Firebase
The Firebase configuration is already set up in `src/config/firebase.config.ts` with the provided credentials:
- Project ID: `elite-motors-c3a08`
- Auth Domain: `elite-motors-c3a08.firebaseapp.com`

**Optional**: To use environment variables instead:
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. Update `firebase.config.ts` to use environment variables

#### Set Up Firestore Database
1. In Firebase Console, go to Firestore Database
2. Create database in production mode
3. Set up security rules (see below)
4. Seed initial data:
   ```bash
   # Import and run the seed function in your app
   # Or create a script in package.json
   ```

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cars collection - read for all, write for authenticated admins
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Bookings collection - create for all, read/update for admins
    match /bookings/{bookingId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
                                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admins collection - read/write only for authenticated admins
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Recently sold collection - read for all, write for admins
    match /recently_sold/{soldId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Create Admin Account
1. Navigate to `/admin/create`
2. Fill in the registration form
3. Check your email for verification link
4. Sign in at `/admin/login`


## 📜 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build production-ready application
- **`npm run build:dev`** - Build in development mode
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

## 📁 Project Structure

```
car-journey-coach-main/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, logos, and media files
│   ├── components/     # Reusable React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── CarCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── PackageCard.tsx
│   ├── context/       # React context providers
│   │   └── TourContext.tsx
│   ├── data/          # Static data and mock data
│   │   └── carsData.ts
│   ├── guides/        # Tour guides and onboarding
│   │   └── tourSteps.ts
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   │   ├── Landing.tsx
│   │   ├── CarsList.tsx
│   │   ├── CarDetails.tsx
│   │   ├── PackageSelection.tsx
│   │   ├── Booking.tsx
│   │   ├── Confirmation.tsx
│   │   ├── RecentlySold.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── AdminLogin.tsx
│   │   └── AdminCreate.tsx
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## 🎯 Usage Guide

### Browsing Vehicles
1. Visit the homepage to see featured vehicles
2. Click "Browse Vehicles" or navigate to the Cars page
3. Click on any vehicle card to view detailed information

### Booking a Test Drive
1. Select a vehicle from the catalog
2. Click "Schedule Test Drive" on the vehicle details page
3. Choose a service package (Basic, Premium, or Ultimate)
4. Fill in your personal information
5. Select preferred date and time
6. Complete the booking and receive confirmation

### Interactive Tour
- Click the "Start Tour" button on the homepage to begin the guided walkthrough
- Follow the step-by-step instructions to learn about all features
- Skip or complete the tour at any time

## 🎨 Customization

### Updating Vehicle Data
Edit `src/data/carsData.ts` to add, remove, or modify vehicle listings.

### Changing Theme Colors
Modify `tailwind.config.ts` and `src/index.css` to customize the color scheme.

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation in `src/components/Navbar.tsx`

## 🏗️ Building for Production

```bash
npm run build
```

The optimized production build will be created in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## 🌐 Deployment

The application can be deployed to any static hosting service:
- **Vercel** - Recommended for Next.js/React apps
- **Netlify** - Easy deployment with Git integration
- **GitHub Pages** - Free hosting for static sites
- **AWS S3 + CloudFront** - Scalable cloud hosting

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or support, please contact the development team or open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
