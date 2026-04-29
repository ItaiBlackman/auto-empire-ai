# System Architecture - AutoEmpire AI

This document outlines the technical architecture, database schema, and core logic of AutoEmpire AI.

## 🏗 Core Architecture

AutoEmpire AI follows a modern serverless architecture using Next.js and Supabase.

- **Client**: Next.js App Router with Tailwind CSS for premium "Dark Luxury" UI.
- **API**: Next.js Route Handlers (Server Actions/API routes).
- **Database**: PostgreSQL on Supabase with Row Level Security (RLS).
- **Auth**: Supabase Auth (Email/Password).
- **AI Engine**: OpenAI GPT-4o for business generation and agent simulation.
- **Payments**: Stripe for subscription management and webhooks.

## 📊 Database Schema

### `profiles`
Extends Supabase Auth users with additional metadata.
- `id`: UUID (FK to auth.users)
- `full_name`: Text
- `avatar_url`: Text
- `billing_address`: JSONB
- `payment_method`: JSONB

### `businesses`
Stores the generated AI businesses.
- `id`: UUID (Primary Key)
- `user_id`: UUID (FK to profiles)
- `name`: Text
- `type`: Text
- `description`: Text
- `data`: JSONB (Stores all AI-generated content like logo prompts, website copy, etc.)
- `status`: Text (creating, active)

### `leads`
CRM data for each business.
- `id`: UUID (Primary Key)
- `business_id`: UUID (FK to businesses)
- `name`: Text
- `email`: Text
- `company`: Text
- `status`: Text (new, contacted, closed)

### `activities`
Stores the "Live" feed of actions performed by AI agents.
- `id`: UUID (Primary Key)
- `business_id`: UUID (FK to businesses)
- `agent_name`: Text (e.g., Sales Manager)
- `action`: Text (Contextual action description)

### `business_tasks`
Tasks assigned to the business/agents.
- `id`: UUID (Primary Key)
- `business_id`: UUID (FK to businesses)
- `title`: Text
- `status`: Text (pending, completed)

### `subscriptions`
Syncs Stripe subscription status.
- `id`: Text (Stripe Subscription ID)
- `user_id`: UUID (FK to profiles)
- `status`: Text
- `price_id`: Text

## 🤖 AI Business Builder Logic

The generation flow (`/api/generate-business`) follows these steps:
1. **User Prompt**: User provides a niche (e.g., "Dentist Agency").
2. **OpenAI Generation**: GPT-4o generates a structured JSON containing brand name, logo prompt, outreach scripts, lead targets, and website content.
3. **Database Persistence**: The business is saved to the `businesses` table.
4. **Dashboard Seeding**: 
   - Initial leads are created in `leads`.
   - Initial activities are simulated in `activities`.
   - Setup tasks are added to `business_tasks`.
5. **Real-time Simulation**: The frontend polls `/api/activities` which periodically triggers the `simulateActivities` function to keep the dashboard feeling alive.

## 💳 Stripe Integration

- **Tiers**: Free (1 business), Pro (5 businesses), Unlimited.
- **Webhooks**: 
  - `checkout.session.completed`: Provisions the subscription in the database.
  - `customer.subscription.deleted`: Revokes access/downgrades user.
  - `invoice.payment_succeeded`: Refreshes subscription period.

## 🔐 Security

All tables have **Row Level Security (RLS)** enabled. 
- Users can only read/write their own profile and businesses.
- Businesses, leads, and activities are filtered by the `user_id` of the owner.
- Service role keys are only used in backend API routes and webhooks.
