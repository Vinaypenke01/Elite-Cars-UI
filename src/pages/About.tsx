import { motion } from 'framer-motion';
import { Award, Users, Car, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every vehicle in our collection meets the highest standards of quality and performance.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Our dedicated team ensures a seamless experience from browsing to driving.',
  },
  {
    icon: Car,
    title: 'Wide Selection',
    description: 'From luxury sedans to sports cars, we have the perfect vehicle for every taste.',
  },
  {
    icon: Shield,
    title: 'Trusted Service',
    description: 'With years of experience, we provide reliable service you can count on.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About Elite Carss</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We are passionate about connecting car enthusiasts with their dream vehicles. 
            Since 2024, we've been the premier destination for luxury and performance automobiles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Elite Carss was founded with a simple mission: to provide an exceptional 
                car buying experience that matches the quality of the vehicles we sell.
              </p>
              <p className="text-muted-foreground">
                Our team of automotive experts carefully curates each vehicle in our 
                inventory, ensuring that every car meets our rigorous standards for 
                performance, condition, and value. Whether you're looking for your 
                first luxury vehicle or adding to your collection, we're here to help.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600"
                alt="Luxury car showroom"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
