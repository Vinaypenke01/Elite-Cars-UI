import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HeroBackground } from '@/components/3d/HeroBackground';
import {
  ArrowRight, Shield, Award, Headphones, Sparkles,
  Star, Quote, Car, Wrench, FileCheck, CreditCard,
  ChevronRight, Play
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Joyride from 'react-joyride';
import { useTour } from '@/context/TourContext';
import { landingSteps } from '@/guides/tourSteps';
import { useFeaturedCars } from '@/hooks/useCars';
import logo from '@/assets/logo.png';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const { run, stepIndex, setStepIndex, stopTour } = useTour();

  // Fetch featured cars from Firestore
  const { data: featuredCarsData = [], isLoading: loadingCars } = useFeaturedCars();
  const featuredCars = featuredCarsData.slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: 'Trusted Quality',
      description: 'Every vehicle undergoes rigorous inspection and certification',
    },
    {
      icon: Award,
      title: 'Premium Selection',
      description: 'Curated collection of luxury and performance vehicles',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated team ready to assist you at any time',
    },
    {
      icon: Sparkles,
      title: 'Best Experience',
      description: 'Seamless journey from browsing to ownership',
    },
  ];

  const services = [
    {
      icon: Car,
      title: 'Vehicle Sales',
      description: 'Premium new and pre-owned luxury vehicles',
    },
    {
      icon: Wrench,
      title: 'Service & Maintenance',
      description: 'Expert care from certified technicians',
    },
    {
      icon: FileCheck,
      title: 'Vehicle Inspection',
      description: 'Comprehensive multi-point inspections',
    },
    {
      icon: CreditCard,
      title: 'Financing Options',
      description: 'Flexible payment plans to suit your needs',
    },
  ];

  const testimonials = [
    {
      name: 'Michael Johnson',
      role: 'Business Executive',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      text: 'Elite Carss exceeded my expectations. The buying process was smooth, and the team was incredibly professional.',
      rating: 5,
    },
    {
      name: 'Sarah Williams',
      role: 'Tech Entrepreneur',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'Found my dream car here! The selection is amazing and the customer service is top-notch.',
      rating: 5,
    },
    {
      name: 'David Chen',
      role: 'Automotive Enthusiast',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: 'Best car dealership experience I\'ve ever had. Transparent pricing and no pressure tactics.',
      rating: 5,
    },
  ];

  const brands = [
    'Tesla', 'Porsche', 'Mercedes-Benz', 'BMW', 'Audi', 'Lucid', 'Ferrari', 'Lamborghini'
  ];

  return (
    <>
      <Joyride
        steps={landingSteps}
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

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-section relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop"
              alt="Luxury car"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
          </div>

          {/* 3D Background Effect */}
          <HeroBackground />

          {/* Animated accent elements */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          />

          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-3xl space-y-8">
              <ScrollReveal direction="left" delay={0.2}>
                <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                  Premium Car Dealership
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Find Your <span className="text-accent">Dream Car</span> Today
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
                  Discover our exclusive collection of luxury and performance vehicles.
                  Experience automotive excellence like never before.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4} className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="explore-btn gap-2 group text-lg px-8 py-6"
                  onClick={() => navigate('/cars')}
                >
                  Browse Vehicles
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-lg px-8 py-6"
                  onClick={() => navigate('/contact')}
                >
                  <Play className="h-5 w-5" />
                  Schedule Test Drive
                </Button>
              </ScrollReveal>

              {/* Stats */}
              <ScrollReveal direction="up" delay={0.6} className="flex gap-8 pt-8">
                <div className="border-l-2 border-accent pl-4">
                  <div className="text-3xl font-bold text-accent">500+</div>
                  <div className="text-sm text-muted-foreground">Premium Vehicles</div>
                </div>
                <div className="border-l-2 border-accent pl-4">
                  <div className="text-3xl font-bold text-accent">50k+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="border-l-2 border-accent pl-4">
                  <div className="text-3xl font-bold text-accent">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-accent rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Brands Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {brands.map((brand, index) => (
                <ScrollReveal
                  key={brand}
                  delay={index * 0.05}
                  direction="up"
                  threshold={0.5}
                  className="text-xl md:text-2xl font-bold text-muted-foreground/50 hover:text-accent transition-colors cursor-pointer"
                >
                  {brand}
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up" className="flex justify-between items-end mb-12">
              <div>
                <Badge className="mb-2">Featured Collection</Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Popular Vehicles
                </h2>
              </div>
              <Link
                to="/cars"
                className="hidden md:flex items-center gap-2 text-accent hover:underline"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars.map((car, index) => (
                <ScrollReveal
                  key={car.id}
                  delay={index * 0.1}
                  direction="up"
                >
                  <Card className="overflow-hidden group cursor-pointer h-full" onClick={() => navigate(`/car/${car.id}`)}>
                    <div className="relative overflow-hidden h-48 sm:h-64">
                      <img
                        src={(car as any).primary_image || (car as any).images?.[0]?.image_url || (car as any).images?.[0]?.image || (car as any).images?.[0] || '/placeholder.svg'}
                        alt={(car as any).manufacturer_name + ' ' + (car as any).model_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onLoad={(e) => console.log(`Landing Page: Loaded image for ${(car as any).model_name}: ${(e.target as HTMLImageElement).src}`)}
                        onError={(e) => console.error(`Landing Page: Failed to load image for ${(car as any).model_name}: ${(e.target as HTMLImageElement).src}`)}
                      />
                      <Badge className="absolute top-4 left-4 bg-accent">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold line-clamp-1">
                            {(car as any).manufacturer_name} {(car as any).model_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{(car as any).body_type}</p>
                        </div>
                        <span className="text-xl font-bold text-accent whitespace-nowrap">₹{((car as any).price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                        <span>{(car as any).fuel_type}</span>
                        <span>•</span>
                        <span>{(car as any).transmission}</span>
                        <span>•</span>
                        <span>{(car as any).model_year}</span>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex justify-center mt-8 md:hidden">
              <Button variant="outline" onClick={() => navigate('/cars')}>
                View All Vehicles
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section py-24 bg-card">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <Badge className="mb-2">Why Choose Us</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                The Elite Carss Difference
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We provide more than just vehicles. We deliver an unparalleled automotive experience.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal
                  key={index}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="text-center p-6 rounded-2xl bg-background border border-border hover:border-accent hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                      <feature.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <Badge className="mb-2">Our Services</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Complete Automotive Solutions
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  From sales to service, we offer comprehensive solutions to meet all your automotive needs.
                  Our expert team is dedicated to providing exceptional experiences at every touchpoint.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map((service, index) => (
                    <ScrollReveal
                      key={service.title}
                      delay={index * 0.1}
                      direction="up"
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" className="relative hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop"
                  alt="Car service"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold">15+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <Badge className="mb-2">Testimonials</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our satisfied customers have to say.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <ScrollReveal
                  key={testimonial.name}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <Quote className="h-10 w-10 text-accent/30 mb-4" />
                      <p className="text-muted-foreground mb-6">{testimonial.text}</p>
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-12 md:p-16">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                  <img src={logo} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
                    Stay Updated
                  </h2>
                  <p className="text-xl text-primary-foreground/90 mb-8">
                    Subscribe to our newsletter for exclusive deals, new arrivals, and automotive insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      placeholder="Enter your email"
                      className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 flex-1"
                    />
                    <Button variant="secondary" size="lg" className="gap-2">
                      Subscribe <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Find Your Perfect Car?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Visit our showroom or browse our online inventory to discover your next vehicle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gap-2 group text-lg px-8 py-6"
                  onClick={() => navigate('/cars')}
                >
                  Explore Inventory
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
