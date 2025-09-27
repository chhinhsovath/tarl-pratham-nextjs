# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaRL Pratham is a Teaching at the Right Level assessment and monitoring system built with Next.js 15. It's a bilingual (English/Khmer) education platform for managing students, assessments, mentoring visits, and tracking learning progress in Cambodia.

## Key Architecture Concepts

### Multi-Platform System
- **Web Admin Interface**: Next.js application for administrators, coordinators, mentors
- **Mobile Interface**: React-based mobile views for teachers and field workers
- **Database**: PostgreSQL with Prisma ORM for data management

### Role-Based Access Control
The system implements a hierarchical role structure:
- **Admin**: Full system access, user management, global reports
- **Coordinator**: Regional oversight, multi-school management
- **Mentor**: School-level guidance, visit tracking, teacher support
- **Teacher**: Student management, assessment entry, class tracking
- **Viewer**: Read-only access for monitoring and reporting

### Assessment Workflow
Three-phase assessment cycle:
1. **Baseline**: Initial student ability measurement
2. **Midline**: Progress tracking during intervention
3. **Endline**: Final assessment after intervention completion

### Authentication System
- **Standard Login**: Email/password for registered users
- **Quick Login**: Username-based access for field workers with limited connectivity
- **Profile Setup**: Required onboarding for new users to set school assignments

## Development Commands

### Core Development
```bash
npm run dev              # Start development server with Turbopack
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Database Operations
```bash
npm run db:generate     # Generate Prisma client after schema changes
npm run db:migrate      # Create and apply new migration
npm run db:push         # Push schema changes without migration
npm run db:studio       # Open Prisma Studio for database inspection
npm run db:seed         # Populate database with initial data
```

### Testing
```bash
npm run test           # Run Playwright tests
npm run test:ui        # Run tests with UI mode
npm run test:report    # Show test results report
```

## Critical Database Patterns

### Schema Architecture
- **Users**: Main user management with role-based fields
- **QuickLoginUser**: Simplified authentication for field access
- **PilotSchool vs School**: Dual school models - `PilotSchool` for program-specific data, `School` for general school information
- **Student**: Core student records with assessment history
- **Assessment**: Flexible assessment system supporting multiple subjects and levels

### Field Naming Convention
The system uses **snake_case** consistently across all database fields, API responses, and TypeScript interfaces for multi-platform compatibility (Next.js ↔ Flutter mobile app).

### Key Relationships
- Users → PilotSchool (many-to-one via pilot_school_id)
- Students → School (many-to-one via school_id)
- Assessments → Student + User (tracking who assessed whom)
- MentoringVisit → User + PilotSchool (visit tracking)

## Frontend Architecture

### Component Structure
- **Page Components**: Located in `app/*/page.tsx` using App Router
- **Layout Components**: Shared layouts in `components/layout/`
- **Provider Components**: Context providers in `components/providers/`

### Styling System
- **Primary**: Tailwind CSS with custom configuration
- **UI Library**: Ant Design for complex components
- **Typography**: Google Hanuman font for Khmer language support
- **Mobile CSS**: Custom mobile styles in `styles/mobile.css`

### State Management
- **Server State**: API calls with built-in React Query patterns
- **Authentication**: NextAuth.js with custom credential providers
- **Form State**: React Hook Form with Zod validation

## API Architecture

### Authentication Patterns
- Most endpoints require authentication via NextAuth session
- Public endpoints (like `/api/public/assessment-data`) allow unauthenticated access
- Quick login users have separate authentication flow

### API Route Structure
```
/api/auth/*              # NextAuth.js authentication
/api/users               # User CRUD operations
/api/students            # Student management
/api/assessments         # Assessment operations
/api/mentoring-visits    # Mentoring visit tracking
/api/reports             # Reporting and analytics
/api/pilot-schools       # School data for dropdowns
/api/dashboard/*         # Role-specific dashboard data
```

### Error Handling
APIs use consistent error response format:
```typescript
{ error: "Error message", status: 400-500 }
```

## Testing Strategy

### Playwright Configuration
- Multi-browser testing (Chrome, Firefox, Safari, Mobile)
- Homepage functionality tests
- API endpoint validation
- Performance monitoring

### Fallback Patterns
When database tables don't exist, APIs provide demo data to ensure frontend functionality continues working during development.

## Internationalization

### Language Support
- **Primary**: Khmer (km) for local users
- **Secondary**: English (en) for administrators
- **Implementation**: React i18next with next-i18next

### Content Strategy
- User interfaces primarily in Khmer
- Technical labels and admin interfaces in English
- Province/district names in local Khmer terminology

## Deployment Considerations

### Environment Setup
- Database URL points to remote PostgreSQL instance
- NextAuth requires NEXTAUTH_URL and NEXTAUTH_SECRET
- File uploads handled via `/api/upload` endpoint

### Build Process
- Uses Next.js 15 with App Router
- Turbopack for development builds
- Static asset optimization for Khmer fonts

## Common Issues and Solutions

### Database Schema Mismatches
When Prisma models don't match actual database tables, APIs include fallback logic to use alternative tables (e.g., `School` instead of `PilotSchool`).

### Authentication Flow
- Quick login provides demo users when `QuickLoginUser` table is empty
- Profile setup form fetches schools from actual database tables
- Session management handles both standard and quick login users

### Mobile Compatibility
- Responsive design uses Tailwind breakpoints
- Touch-friendly UI components with minimum 44px touch targets
- Custom mobile CSS for platform-specific behaviors