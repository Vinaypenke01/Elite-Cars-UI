import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "@/context/TourContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainLayout from "@/components/layouts/MainLayout";
import Landing from "./pages/Landing";
import CarsList from "./pages/CarsList";
import CarDetails from "./pages/CarDetails";
import PackageSelection from "./pages/PackageSelection";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import RecentlySold from "./pages/RecentlySold";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminCreate from "./pages/AdminCreate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TourProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/cars" element={<CarsList />} />
                <Route path="/car/:id" element={<CarDetails />} />
                <Route path="/package/:id" element={<PackageSelection />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/recently-sold" element={<RecentlySold />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes - Clean Workspace */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/create" element={<AdminCreate />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TourProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
