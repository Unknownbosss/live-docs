# LiveDocs - Real-time Collaborative Editor

LiveDocs is a modern, full-stack collaborative document editing platform that allows multiple users to create, edit, and share documents in real-time. Built with a focus on speed, reliability, and high-quality user experience.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously with live cursor tracking and presence indicators.
- **Rich Text Editing**: A powerful editor powered by Lexical, supporting formatting, lists, quotes, links, and code blocks.
- **Commenting System**: Add comments and threads directly within the document for seamless feedback.
- **Advanced Permissions**: Manage document access with Owner, Editor, and Viewer roles.
- **Notifications**: Stay updated with real-time notifications for document activity and mentions.
- **Authentication**: Secure user management and authentication powered by Clerk.
- **Responsive Design**: A sleek, modern UI built with Tailwind CSS v4 and Shadcn UI components.
- **Monitoring**: Error tracking and performance monitoring with Sentry.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Collaboration**: [Liveblocks](https://liveblocks.io/)
- **Editor**: [Lexical](https://lexical.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Monitoring**: [Sentry](https://sentry.io/)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/unknownbosss/live-docs.git
   cd live-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   LIVEBLOCKS_SECRET_KEY=
   SENTRY_AUTH_TOKEN=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

- `app/`: Next.js pages, layouts, and API routes.
- `components/`: Reusable UI components.
  - `editor/`: Lexical editor implementation.
  - `ui/`: Base UI components (Shadcn).
- `lib/`: Utility functions, server actions, and Liveblocks config.
- `public/`: Static assets.
- `types/`: Global TypeScript definitions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
