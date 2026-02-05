import { Mail, Phone, MapPin, Shield, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const { settings: contactInfo } = useSettings();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Elite Carss Logo" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in premium automotive excellence since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-muted-foreground hover:text-accent transition-colors">
                  Current Stock
                </Link>
              </li>
              <li>
                <Link to="/recently-sold" className="text-muted-foreground hover:text-accent transition-colors">
                  Recently Sold
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h3 className="font-semibold mb-4">Admin</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Login
                </Link>
              </li>
              <li>
                <Link to="/admin/create" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <span>{contactInfo.email}</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>


        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Elite Carss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
