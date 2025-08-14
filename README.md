# Driver Application Admin Dashboard

This application has been successfully migrated from Vite + Express to Next.js for optimal Vercel deployment.

## Migration Completed ✅

The application has been fully migrated to Next.js with the following structure:

### Next.js App Structure
- `app/` - Next.js 14 App Router directory
- `app/layout.tsx` - Root layout with providers and styling
- `app/page.tsx` - Main page with auth routing logic
- `app/auth/page.tsx` - OTP authentication page
- `app/dashboard/page.tsx` - Admin dashboard
- `app/components/` - React components including ApplicationModal, OtpForm
- `app/hooks/` - Custom hooks including useAuth
- `app/lib/` - Utilities including queryClient and API helpers

### Key Features Migrated
- ✅ OTP-based phone number authentication
- ✅ JWT token management with localStorage persistence
- ✅ Driver application management (view, approve, reject)
- ✅ Notion-style design system maintained
- ✅ All shadcn/ui components preserved
- ✅ TanStack Query for server state management
- ✅ Next.js client components with 'use client' directives
- ✅ Proper TypeScript configuration

### Running the Application

#### Development (Next.js)
```bash
npx next dev
```
The app will run on http://localhost:3000

#### Production Build
```bash
npx next build
npx next start
```

### Deployment to Vercel

This Next.js application is now ready for Vercel deployment:

1. Connect your repository to Vercel
2. Vercel will automatically detect Next.js and use the optimal build settings
3. The app will deploy with automatic serverless functions and edge optimization

### Environment Variables
Make sure to set these environment variables in Vercel:
- Any secrets needed for the Neighborly API integration

### API Integration
The app connects directly to the Neighborly API at `https://api.neighborly.live/api`:
- Authentication: `/auth/otp/send`, `/auth/otp/verify`, `/users/me`
- Applications: `/driver-applications`, approve/reject endpoints

The migration is complete and the application maintains all existing functionality while being optimized for Vercel's serverless platform.