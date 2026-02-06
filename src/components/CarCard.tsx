import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CarCardProps {
  id: number;
  manufacturer_name?: string;
  model_name?: string;
  name?: string;
  price: number;
  primary_image?: string;
  images?: string[];
  car_images?: Array<{ image: string }>;
  image?: string;
  body_type?: string;
  type?: string;
  fuel_type?: string;
  transmission?: string;
  model_year?: number;
  featured?: boolean;
}

const CarCard = ({ id, manufacturer_name, model_name, name, price, primary_image, images, car_images, image, body_type, type, fuel_type, transmission, model_year, featured }: CarCardProps) => {
  const navigate = useNavigate();

  const getImageUrl = (img: any) => {
    if (typeof img === 'string') return img;
    return img?.image_url || img?.image || '/placeholder.svg';
  };

  const displayImage = getImageUrl(primary_image) ||
    getImageUrl(car_images?.[0]) ||
    getImageUrl(images?.[0]) ||
    getImageUrl(image) ||
    '/placeholder.svg';

  const carName = name || `${manufacturer_name || ''} ${model_name || ''}`.trim() || 'Unknown Car';
  const carType = body_type || type || 'Vehicle';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="car-card"
    >
      <Card
        className="overflow-hidden cursor-pointer border-border hover:border-accent transition-all duration-300 h-full"
        onClick={() => navigate(`/car/${id}`)}
      >
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative h-64 overflow-hidden bg-muted">
            <img
              src={displayImage}
              alt={carName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onLoad={() => {
                console.log(`✅ Image loaded successfully for ${carName}: ${displayImage}`);
              }}
              onError={(e) => {
                console.error(`❌ Error loading image for ${carName}: ${displayImage}`);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            {featured && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary">{carType}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{carName}</h3>
              <p className="text-3xl font-bold text-accent">₹{price?.toLocaleString() || '0'}</p>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-4">
              {fuel_type && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-accent" />
                  <span>{fuel_type}</span>
                </div>
              )}
              {transmission && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="h-4 w-4 text-accent" />
                  <span>{transmission}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={() => navigate(`/car/${id}`)}
            className="w-full gap-2 group"
            variant="default"
          >
            View Details
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CarCard;
