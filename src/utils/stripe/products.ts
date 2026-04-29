export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for exploring the platform',
    price: 0,
    features: [
      '1 AI Business',
      'Basic AI Employees',
      'Standard Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious entrepreneurs',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: [
      '5 AI Businesses',
      'Advanced AI Employees',
      'Priority Support',
      'Custom Branding',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    description: 'The ultimate empire builder',
    price: 199,
    priceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID,
    features: [
      'Unlimited AI Businesses',
      'Full AI Staff',
      '24/7 Concierge Support',
      'White-label options',
      'API Access',
    ],
  },
];
