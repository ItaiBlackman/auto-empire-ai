const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function seedProducts() {
  const products = [
    {
      name: 'Pro Tier',
      description: 'Advanced features for serious entrepreneurs',
      amount: 4900, // $49.00
      interval: 'month',
    },
    {
      name: 'Unlimited Tier',
      description: 'Ultimate scaling for your AI empire',
      amount: 19900, // $199.00
      interval: 'month',
    },
  ];

  for (const productData of products) {
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.amount,
      currency: 'usd',
      recurring: {
        interval: productData.interval,
      },
    });

    console.log(`Created product ${productData.name}:`);
    console.log(`  Product ID: ${product.id}`);
    console.log(`  Price ID: ${price.id}`);
  }
}

seedProducts().catch(console.error);
