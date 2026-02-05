import { Step } from 'react-joyride';

export const landingSteps: Step[] = [
  {
    target: '.hero-section',
    content: 'Welcome to Elite Motors! This is your starting point to discover premium vehicles.',
    disableBeacon: true,
    placement: 'center',
  },
  {
    target: '.explore-btn',
    content: 'Click here to explore our curated collection of luxury vehicles.',
    placement: 'bottom',
  },
  {
    target: '.features-section',
    content: 'Learn about what makes Elite Motors your trusted automotive partner.',
    placement: 'top',
  },
];

export const carsListSteps: Step[] = [
  {
    target: '.cars-header',
    content: 'Browse through our premium vehicle collection. Each car is carefully selected for quality and performance.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.car-card:first-child',
    content: 'Click on any vehicle card to view detailed specifications, features, and pricing.',
    placement: 'right',
  },
  {
    target: '.filter-section',
    content: 'Use filters to narrow down your search by type, price range, or features.',
    placement: 'left',
  },
];

export const carDetailsSteps: Step[] = [
  {
    target: '.car-hero',
    content: 'Here you can see high-quality images and complete specifications of the vehicle.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.specs-section',
    content: 'Review detailed specifications including engine, performance, and features.',
    placement: 'top',
  },
  {
    target: '.package-btn',
    content: 'Ready to proceed? Choose your preferred package to continue.',
    placement: 'top',
  },
];

export const packageSteps: Step[] = [
  {
    target: '.packages-container',
    content: 'Select the package that best fits your needs. Each package offers different levels of service and benefits.',
    disableBeacon: true,
    placement: 'top',
  },
  {
    target: '.package-card:first-child',
    content: 'Compare features, pricing, and benefits across our three packages.',
    placement: 'bottom',
  },
  {
    target: '.proceed-btn',
    content: 'Once you\'ve selected a package, proceed to booking your test drive or finalizing your purchase.',
    placement: 'top',
  },
];

export const bookingSteps: Step[] = [
  {
    target: '.booking-form',
    content: 'Fill in your details to schedule a test drive or complete your vehicle purchase.',
    disableBeacon: true,
    placement: 'right',
  },
  {
    target: '.date-picker',
    content: 'Select your preferred date and time for the test drive.',
    placement: 'bottom',
  },
  {
    target: '.submit-btn',
    content: 'Review your information and submit to confirm your booking.',
    placement: 'top',
  },
];

export const confirmationSteps: Step[] = [
  {
    target: '.confirmation-card',
    content: 'Congratulations! Your booking has been confirmed. Check your email for details.',
    disableBeacon: true,
    placement: 'center',
  },
  {
    target: '.booking-details',
    content: 'Here are your booking details. You can download or print this confirmation.',
    placement: 'bottom',
  },
  {
    target: '.next-steps',
    content: 'These are your next steps. We look forward to seeing you at Elite Motors!',
    placement: 'top',
  },
];
