export interface Car {
  id: number;
  name: string;
  price: string;
  images: string[];
  type: string;
  specs: {
    power: string;
    speed: string;
    acceleration: string;
    range: string;
  };
  description: string;
  features: string[];
  featured?: boolean;
  car_images?: Array<{ id: number, image: string, is_main: boolean, order: number }>;
}

export const carsData: Car[] = [
  {
    id: 1,
    name: 'Tesla Model S Plaid',
    price: '$129,990',
    images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop'],
    type: 'Electric',
    specs: {
      power: '1,020 hp',
      speed: '200 mph',
      acceleration: '0-60 in 1.99s',
      range: '396 miles',
    },
    description: 'The quickest accelerating production car ever made. Experience unprecedented performance with tri-motor all-wheel drive and cutting-edge autopilot technology.',
    features: [
      'Tri Motor All-Wheel Drive',
      'Autopilot Included',
      '17" Cinematic Display',
      'Premium Interior',
      'Glass Roof',
      'Advanced Air Filtration',
    ],
    featured: true,
  },
  {
    id: 2,
    name: 'Porsche Taycan Turbo S',
    price: '$185,000',
    images: ['https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop'],
    type: 'Electric',
    specs: {
      power: '750 hp',
      speed: '161 mph',
      acceleration: '0-60 in 2.6s',
      range: '201 miles',
    },
    description: 'Pure Porsche performance meets electric innovation. The Taycan Turbo S delivers exhilarating driving dynamics with zero emissions.',
    features: [
      'All-Wheel Drive',
      'Adaptive Air Suspension',
      'Porsche Communication Management',
      'Premium Leather Interior',
      '800V Architecture',
      'Porsche Active Suspension',
    ],
    featured: true,
  },
  {
    id: 3,
    name: 'Mercedes-Benz EQS',
    price: '$102,310',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'],
    type: 'Electric Luxury',
    specs: {
      power: '516 hp',
      speed: '130 mph',
      acceleration: '0-60 in 4.1s',
      range: '350 miles',
    },
    description: 'The pinnacle of electric luxury. The EQS combines Mercedes-Benz craftsmanship with revolutionary electric technology and the stunning MBUX Hyperscreen.',
    features: [
      'MBUX Hyperscreen',
      'Air Suspension with Adaptive Damping',
      'Burmester 3D Sound System',
      'Executive Rear Seats',
      'Advanced Driver Assistance',
      'Premium Nappa Leather',
    ],
  },
  {
    id: 4,
    name: 'BMW iX M60',
    price: '$111,500',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'],
    type: 'Electric SUV',
    specs: {
      power: '619 hp',
      speed: '155 mph',
      acceleration: '0-60 in 3.6s',
      range: '288 miles',
    },
    description: 'BMW\'s flagship electric SUV. The iX M60 offers spacious luxury, cutting-edge technology, and impressive performance in a sustainable package.',
    features: [
      'M Sport Package',
      'Curved Display',
      'Bowers & Wilkins Audio',
      'Sky Lounge Panoramic Roof',
      'Adaptive M Suspension',
      'BMW Intelligent Personal Assistant',
    ],
  },
  {
    id: 5,
    name: 'Audi e-tron GT',
    price: '$104,900',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'],
    type: 'Electric Sports',
    specs: {
      power: '522 hp',
      speed: '152 mph',
      acceleration: '0-60 in 3.9s',
      range: '238 miles',
    },
    description: 'Where quattro meets electric. The e-tron GT combines Audi\'s legendary all-wheel drive with stunning design and electrifying performance.',
    features: [
      'Quattro All-Wheel Drive',
      'Adaptive Air Suspension',
      'Virtual Cockpit Plus',
      'Matrix LED Headlights',
      'Premium Plus Package',
      'Bang & Olufsen Sound',
    ],
  },
  {
    id: 6,
    name: 'Lucid Air Dream',
    price: '$169,000',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop'],
    type: 'Electric Luxury',
    specs: {
      power: '1,111 hp',
      speed: '168 mph',
      acceleration: '0-60 in 2.5s',
      range: '503 miles',
    },
    description: 'Redefining luxury electric vehicles. The Air Dream Edition offers unprecedented range, power, and interior space in a beautifully designed package.',
    features: [
      'Glass Canopy Roof',
      '34" 5K Glass Cockpit Display',
      'Surreal Sound Pro Audio',
      'Executive Rear Seating',
      'DreamDrive Pro',
      'Santa Monica Interior',
    ],
    featured: true,
  },
];
