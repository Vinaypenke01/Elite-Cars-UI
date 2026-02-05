import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginAdmin } from '@/services/api.service';
import logo from '@/assets/logo.png';

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, setUser, setAdminProfile } = useAuth(); // Get auth state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginAdmin(formData.email, formData.password);

      // Update Context
      setUser({
        id: response.user.uid,
        email: response.user.email,
        display_name: response.user.display_name
      });
      setAdminProfile(response.user); // Response user matches AdminProfile interface

      toast({
        title: 'Login Successful',
        description: 'Welcome back to Elite Motors Admin!',
      });
      // Navigation will be handled by useEffect
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid credentials';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Redirect when admin status is confirmed
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Elite Motors" className="h-16 w-auto" />
            </div>
            <div className="flex justify-center mb-2">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/admin/create" className="text-accent hover:underline">
                Create Admin Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
