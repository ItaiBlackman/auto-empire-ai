# AutoEmpire AI

Build your AI Empire in 60 seconds.

AutoEmpire AI is a premium, full-stack SaaS platform that allows users to launch ready-made AI businesses with a single prompt.

## 🚀 Features

- **One-Click Business Builder**: Type a niche, and we generate the brand, logo, website, outreach scripts, and more.
- **Live AI Agents**: Each business is staffed with specialized AI employees (Sales Manager, Lead Finder, Copywriter, etc.) that work for you in real-time.
- **Dynamic Dashboard**: Track revenue, leads, and agent activities in a beautiful, "dark luxury" interface.
- **Stripe Integration**: Automated subscription tiers (Free, Pro, Unlimited) with seamless checkout and management.
- **Full Ownership**: Launch instantly without approval queues.

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, RLS)
- **AI**: [OpenAI GPT-4o](https://openai.com/)
- **Payments**: [Stripe](https://stripe.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- Supabase Project
- OpenAI API Key
- Stripe Account

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

OPENAI_API_KEY=your_openai_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID=price_...
```

### Installation

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Database Setup**
   Apply the migrations found in `supabase/migrations` to your Supabase project.
4. **Stripe Setup**
   Run the seeding script to create products and prices:
   ```bash
   node scripts/seed-stripe.js
   ```
5. **Run the app**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

For a detailed look at the system architecture and database schema, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📄 License

MIT
