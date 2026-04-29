import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder', {
  apiVersion: '2025-01-27.acacia' as any,
  appInfo: {
    name: 'AutoEmpire AI',
    version: '0.1.0',
  },
});
