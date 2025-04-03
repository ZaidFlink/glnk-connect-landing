# GLNK Connect Landing Page

Enterprise-level landing page for GLNK Connect, featuring responsive design, animations, and email subscription capabilities.

## Features

- **Responsive Design**: Optimized for both desktop and mobile users
- **Modern UI**: Clean interface with professional styling and animations
- **Email Subscription**: Form to collect visitor emails with duplicate protection
- **Admin Dashboard**: Simple admin panel at `/admin` to view collected emails
- **Company Showcase**: Animated carousel displaying partner logos

## Development Setup

### Prerequisites
- Node.js (14.x or higher)
- Yarn package manager

### Installation

1. Clone the repository
2. Navigate to the landing directory
3. Install dependencies:

```bash
yarn install
```

4. Start the development server:

```bash
yarn dev
```

The site will be available at http://localhost:3000 (or the next available port if 3000 is in use).

## Email Subscription System

The current implementation uses an in-memory storage system for development purposes. For production use, you'll need to integrate with a proper database or email service provider.

### Current Implementation

- Emails are stored in-memory during server runtime
- Duplicate emails are automatically rejected
- Admin page at `/admin` shows all collected emails

### Production Recommendations

For production deployment, implement one of these solutions:

1. **Database Storage**:
   - Supabase (PostgreSQL)
   - MongoDB Atlas
   - Firebase Firestore

2. **Email Marketing Services**:
   - Mailchimp
   - ConvertKit
   - SendGrid

See the admin page for detailed implementation steps.

## Project Structure

- `app/` - Next.js application pages and components
- `public/` - Static assets including images and logos
- `api/` - API routes for handling email subscriptions
- `styles/` - Global styles and Tailwind CSS configuration

## Deployment

This is a Next.js application that can be deployed to:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Any other platform supporting Next.js apps

## Security Considerations

Before deploying to production:

1. Implement proper authentication for the admin page
2. Set up environment variables for sensitive information
3. Replace the in-memory email storage with a database solution
4. Consider adding CSRF protection and rate limiting 