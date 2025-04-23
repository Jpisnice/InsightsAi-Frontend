# InsightsAI

InsightsAI is a modern web application for intelligent document management and analysis. It leverages advanced OCR (Optical Character Recognition) and AI-powered search to help users upload, process, and extract insights from documents such as PDFs, Word files, and images.

## Features
- **Document Upload & Preview:** Upload PDFs and other documents, preview their content, and manage your document library.
- **OCR Processing:** Uses the Mistral API to extract text and structure from scanned documents and images.
- **AI-Powered Search:** Quickly search across your documents using fuzzy and semantic search capabilities.
- **Insight Extraction:** Ask questions and extract key information from documents using large language models.
- **Rich UI Components:** Interactive document viewer, search bar, drag-and-drop organization, and more.

## Technologies Used
- **Next.js** (React framework for SSR and SSG)
- **TypeScript** (type safety)
- **Mistral API** (OCR and document understanding)
- **Radix UI** (UI primitives)
- **Tailwind CSS** (utility-first styling)
- **MongoDB** (document storage, if backend is enabled)
- **Other:** Swapy (drag-and-drop), Lucide Icons, and more

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/app/` — Main Next.js app pages and API routes
- `src/components/` — UI and functional components
- `src/lib/` — Utility libraries (search, OCR integration, etc.)
- `public/uploads/` — Uploaded documents
- `screenshots/` — App screenshots

## Screenshots
See the `screenshots/` folder for UI examples.

