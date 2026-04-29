# Documentation: Laman.ai - AI Sales Page Generator

## Project Overview
Laman.ai is a web application designed to transform raw product or service information into structured sales pages. This project was developed as part of a technical assessment for PT Dakwah Digital Network, addressing Option B: AI Sales Page Generator.

The system utilizes Large Language Models (LLMs) to generate marketing copy and renders it into a responsive landing page layout.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI & Lucide React
- **Animations:** Framer Motion
- **Database & Auth:** Supabase (PostgreSQL)
- **AI Engine:** Groq SDK (Llama-3 models)
- **Language:** TypeScript

## Key Features

### 1. User Authentication
- Register, login, and logout functionality using Supabase Auth.
- Middleware protection for the generator and history pages.

### 2. Product Input Form
- A structured form to collect product data:
    - Product/Service Name
    - Description
    - Key Features
    - Target Audience
    - Pricing
    - Unique Selling Points

### 3. AI Sales Page Generation
- Integration with Groq LLM to generate sales copy.
- The output includes headlines, product descriptions, benefits, features, social proof placeholders, pricing, and calls-to-action.

### 4. Live Preview
- A responsive preview mode that displays the generated content in a landing page layout immediately after generation.

### 5. Generation History
- All generated pages are stored in the database.
- Users can view, re-generate, and delete past pages from a dashboard.

## Approach and Logic

### Technical Implementation
The application uses a specific prompt structure to instruct the LLM to return data in a structured JSON format. This allows the frontend to parse the response and map it directly to pre-defined UI components while maintaining layout consistency.

### Data Management
Every generation is linked to the user's account. When a page is generated, the data is processed by the AI, displayed in the preview, and stored in the `saved_pages` table in Supabase.

### Design and Responsiveness
Using Tailwind CSS and container-based layouts, the sales page is designed to be fully responsive across mobile, tablet, and desktop devices.

## Setup and Installation

### Prerequisites
- Node.js (Latest LTS)
- Supabase Account
- Groq API Key

### Installation
1. Clone the repository and navigate to the project folder.
2. Install dependencies using `npm install`.
3. Create a `.env.local` file with the following variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - GROQ_API_KEY
4. Run the development server with `npm run dev`.

## Database Structure
The project uses a `saved_pages` table:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `product_name`: Text
- `content`: JSONB (Stores headlines, features, pricing, etc.)
- `created_at`: Timestamp

## Submission Info
- **Developer:** [Nama Lengkap Anda]
- **Task:** Option B (AI Sales Page Generator)
- **Deadline:** 29 April 2026
