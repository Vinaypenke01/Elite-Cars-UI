import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useTour } from '@/context/TourContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { startTour } = useTour();
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cars', label: 'Current Stock' },
    { path: '/recently-sold', label: 'Recently Sold' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.img
              src={logo}
              alt="Elite Carss Logo"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${isActive(link.path) ? 'text-accent' : 'text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-accent underline-offset-4 hover:underline">
                  Dashboard
                </Button>
              </Link>
            )}

            {!user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={startTour}
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Start Tour
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-accent ${isActive(link.path) ? 'text-accent' : 'text-foreground'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {!user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      startTour();
                      setIsOpen(false);
                    }}
                    className="gap-2 w-full"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Start Tour
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
