Laman.ai — AI-Powered Sales Page Generator

Laman.ai is a high-performance web application designed to transform raw product or service descriptions into structured, high-converting sales pages in seconds. Built with a modern tech stack, it leverages Large Language Models (LLMs) to handle copywriting and layout design, allowing users to focus on their business while the AI handles the web presence.

✨ Key Features

AI Copywriting Engine: Utilizes the Groq SDK (Llama-3 models) to generate persuasive headlines, features, benefits, and calls-to-action in natural, marketing-focused Indonesian.

Dynamic Styling & Layouts: Supports multiple design aesthetics including Glassmorphism, Neo-Brutalism, Dark Tech, and Minimalist styles, ensuring every generation is unique.

Live Preview: Immediate responsive preview of the generated landing page layout right after the generation process.

Smart Refinement: Refine specific sections of your page using natural language feedback (e.g., "make the headline more aggressive" or "change the CTA button text").

Generation History: Securely store and manage your generated pages. Users can view, re-generate, or delete past projects.

Code-Ready Output: Designed with clean, semantic HTML and Tailwind CSS utility classes, making the generated results easy to export and implement.

🚀 Tech Stack

Framework: Next.js 15+ (App Router)

Styling: Tailwind CSS 4

Animations: Framer Motion

AI Engine: Groq Cloud SDK (Llama-3.3-70b-versatile)

Backend & Auth: Supabase (PostgreSQL & Auth)

Icons: Lucide React

🛠️ Installation & Setup

Prerequisites

Node.js (Latest LTS)

A Supabase Project

A Groq API Key

Local Setup

Clone the repository:

git clone [https://github.com/yourusername/laman-ai.git](https://github.com/yourusername/laman-ai.git)
cd laman-ai


Install dependencies:

npm install


Environment Variables:
Create a .env.local file in the root directory and add your credentials:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key


Run the development server:

npm run dev


Open http://localhost:3000 to see the application.

📂 Database Schema

The application uses a saved_pages table in Supabase:

id: UUID (Primary Key)

user_id: UUID (Foreign Key to Auth)

product_name: Text

content: JSONB (Stores headlines, benefits, feature list, pricing, and style metadata)

created_at: Timestamp

📝 Submission Info

This project was developed as a technical assessment for PT Dakwah Digital Network.

Developer: [Your Full Name]

Task: Option B (AI Sales Page Generator)

Deadline: April 29, 2026

Built with ❤️ using Next.js and AI.
