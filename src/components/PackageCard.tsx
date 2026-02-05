import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PackageCardProps {
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}

const PackageCard = ({ title, price, features, popular, onSelect }: PackageCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: popular ? 1.05 : 1.02 }}
      transition={{ duration: 0.3 }}
      className="package-card h-full"
    >
      <Card
        className={`relative h-full flex flex-col ${
          popular
            ? 'border-2 border-accent shadow-lg shadow-accent/20'
            : 'border-border'
        }`}
      >
        {popular && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
            Most Popular
          </Badge>
        )}

        <CardHeader className="text-center pb-8 pt-8">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-accent">{price}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="rounded-full bg-accent/10 p-1 mt-0.5">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm text-muted-foreground flex-1">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-6">
          <Button
            onClick={onSelect}
            className="w-full"
            variant={popular ? 'default' : 'outline'}
          >
            Select Package
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PackageCard;
