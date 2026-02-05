import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Calendar, Clock, Mail, Phone, Download, Home } from 'lucide-react';
import Joyride from 'react-joyride';
import { useTour } from '@/context/TourContext';
import { confirmationSteps } from '@/guides/tourSteps';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { run, stepIndex, setStepIndex, stopTour } = useTour();

  const { car, package: selectedPackage, booking } = location.state || {};

  if (!car || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">No Booking Found</h1>
          <Button onClick={() => navigate('/cars')}>Back to Collection</Button>
        </div>
      </div>
    );
  }

  const bookingNumber = `EM-${Date.now().toString().slice(-8)}`;

  return (
    <>
      <Joyride
        steps={confirmationSteps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        showProgress
        callback={(data) => {
          const { status, index, type } = data;
          if (type === 'step:after') {
            setStepIndex(index + 1);
          }
          if (status === 'finished' || status === 'skipped') {
            stopTour();
          }
        }}
        styles={{
          options: {
            primaryColor: 'hsl(217 91% 50%)',
            zIndex: 10000,
          },
        }}
      />

      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-6">
              <CheckCircle2 className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thank you for choosing Elite Motors. Your test drive has been successfully scheduled.
            </p>
          </motion.div>

          {/* Confirmation Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="confirmation-card max-w-4xl mx-auto mb-8"
          >
            <Card className="border-accent">
              <CardContent className="booking-details p-8">
                {/* Booking Number */}
                <div className="text-center mb-8 pb-8 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
                  <p className="text-3xl font-bold text-accent">{bookingNumber}</p>
                </div>

                {/* Vehicle Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{car.name}</h3>
                      <p className="text-xl font-bold text-accent">{car.price}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package</span>
                        <span className="font-medium">{selectedPackage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">{car.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-muted/50 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{booking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{booking.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="next-steps">
                  <h3 className="text-xl font-bold mb-4">What's Next?</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">1</span>
                      <span>You'll receive a confirmation email at <strong className="text-foreground">{booking.email}</strong> within the next few minutes.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">2</span>
                      <span>Our team will contact you within 24 hours to confirm availability and provide additional details.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">3</span>
                      <span>Arrive 15 minutes early on your scheduled date. Bring a valid driver's license and proof of insurance.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">4</span>
                      <span>Experience the vehicle with our expert team and discuss financing options if interested.</span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="h-5 w-5" />
              Download Confirmation
            </Button>
            <Button size="lg" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 text-sm text-muted-foreground"
          >
            <p>
              Need to reschedule or have questions?{' '}
              <a href="mailto:support@elitemotors.com" className="text-accent hover:underline">
                Contact our support team
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Confirmation;
