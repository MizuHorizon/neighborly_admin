# Driver Application Admin Dashboard

## Overview

This is a React-based admin dashboard for managing driver applications for a ride-sharing service called "Neighborly". The application allows administrators to review, approve, or reject driver applications submitted through the external Neighborly API. The frontend connects directly to the external API at https://api.neighborly.live/api for all data operations, including OTP-based authentication and driver application management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React stack with TypeScript:
- **React 18** with functional components and hooks
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and API caching
- **React Hook Form** with **Zod** for form validation
- **Tailwind CSS** with **shadcn/ui** component library for styling

### Authentication System
- **OTP-based authentication** using phone numbers
- Two-step process: send OTP to phone, then verify with 6-digit code
- JWT tokens stored in localStorage for session management
- Protected routes that redirect unauthenticated users to login
- Automatic token refresh and 401 error handling

### State Management
- **TanStack Query** handles all server state and caching
- **React Context** for authentication state
- **React Hook Form** for form state management
- Local component state for UI interactions (modals, loading states)

### Component Architecture
- **shadcn/ui** provides the base UI component library
- Custom components built on top of Radix UI primitives
- Consistent design system with CSS variables for theming
- Mobile-responsive design with Tailwind CSS
- Toast notifications for user feedback

### API Integration
The frontend communicates directly with the external Neighborly API:
- **Base URL**: https://api.neighborly.live/api
- **Authentication endpoints**: `/auth/otp/send`, `/auth/otp/verify`, `/auth/me`
- **Driver application endpoints**: `/driver-applications`, `/driver-applications/{id}/approve`, `/driver-applications/{id}/reject`
- All requests include JWT token in Authorization header
- Error handling with custom ApiError class

### Data Models
Key TypeScript interfaces defined in shared schema:
- **User**: Admin user information with role-based access
- **DriverApplication**: Complete driver application with personal info, documents, and car details
- **Car**: Vehicle information linked to driver applications
- Form validation schemas using Zod for type safety

### Backend Architecture
Minimal Express.js server that primarily serves the React frontend:
- **Static file serving** in production
- **Vite development middleware** in development mode
- No database or API routes - all data operations handled by external API
- Request logging middleware for debugging
- Error handling middleware

### Build and Deployment
- **Development**: Vite dev server with HMR and React Fast Refresh
- **Production**: Vite builds optimized bundle, Express serves static files
- **Database migrations**: Drizzle Kit configured for PostgreSQL (though not used in current implementation)
- **TypeScript**: Strict type checking across client, server, and shared code

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (configured but not actively used)
- **drizzle-orm**: Database ORM and migration tool
- **express**: Node.js web server framework
- **vite**: Frontend build tool and development server

### React Ecosystem
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers

### UI and Styling
- **@radix-ui/***: Headless UI component primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

### Validation and Utilities
- **zod**: TypeScript-first schema validation
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### External API Services
- **Neighborly API** (https://api.neighborly.live/api): Primary data source for authentication and driver applications
- **AWS S3**: Document storage for driver licenses, insurance, and vehicle registration (URLs provided by API)