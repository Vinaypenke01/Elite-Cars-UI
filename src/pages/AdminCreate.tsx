import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin } from '@/services/api.service';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import logo from '@/assets/logo.png';

const AdminCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Info, Step 2: OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');

  // Generate OTP when moving to step 2
  useEffect(() => {
    if (step === 2) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log('Generated OTP:', newOtp); // For development convenience
    }
  }, [step]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setUserOtp('');
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userOtp !== generatedOtp) {
      toast({
        title: 'Invalid OTP',
        description: 'The OTP entered is incorrect. Please check the screen.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Register admin with Django API
      await registerAdmin(
        formData.email,
        formData.password,
        formData.name,
        'admin'
      );

      toast({
        title: 'Account Created Successfully',
        description: 'Your admin account has been created and verified.',
      });

      // Navigate to login page
      navigate('/admin/login');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
              {step === 1 ? (
                <UserPlus className="h-8 w-8 text-accent" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-accent" />
              )}
            </div>
            <CardTitle>{step === 1 ? 'Create Admin Account' : 'Verify Identity'}</CardTitle>
            <CardDescription>
              {step === 1
                ? 'Set up a new administrator account'
                : 'For security, please enter the OTP displayed below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
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
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password (min. 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Next: Verify OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-6 flex flex-col items-center">
                <div className="p-4 bg-accent/10 rounded-lg text-center w-full mb-2">
                  <p className="text-sm text-muted-foreground mb-2">Your Verification Code is:</p>
                  <p className="text-4xl font-bold tracking-[0.5em] text-accent font-mono">{generatedOtp}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-center block">Enter Code</label>
                  <InputOTP
                    maxLength={6}
                    value={userOtp}
                    onChange={(value) => setUserOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="w-full space-y-3">
                  <Button type="submit" className="w-full" disabled={loading || userOtp.length !== 6}>
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      setStep(1);
                      setUserOtp('');
                    }}
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Info
                  </Button>
                </div>
              </form>
            )}

            {step === 1 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/admin/login" className="text-accent hover:underline">
                  Sign In
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminCreate;
