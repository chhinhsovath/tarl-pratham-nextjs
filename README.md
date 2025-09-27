# TaRL Pratham - Next.js Application

Teaching at the Right Level Assessment and Monitoring System

## Features

- **User Management**: Role-based access control (Admin, Teacher, Mentor, Coordinator)
- **School Management**: Complete CRUD operations for schools and pilot schools
- **Student Management**: Track students with photos, grades, and assessment data
- **Assessment System**: Baseline, Midline, and Endline assessments
- **Mentoring Visits**: Document and track mentoring activities
- **Intervention Programs**: Manage and track student interventions
- **Reporting**: Comprehensive reports for tracking student progress
- **Multi-language Support**: English and Khmer language support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Ant Design
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Font**: Google Hanuman

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```env
# Database
DATABASE_URL="postgresql://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database (optional):
```bash
npx prisma db seed
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Build for Production

```bash
npm run build
npm start
```

## Database Management

- View database: `npx prisma studio`
- Create migration: `npx prisma migrate dev --name migration_name`
- Deploy migrations: `npx prisma migrate deploy`
- Reset database: `npx prisma migrate reset`

## Project Structure

```
tarl-pratham-nextjs/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── ...               # Other pages
├── components/            # React components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # NextAuth configuration
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── public/               # Static files
└── types/                # TypeScript type definitions
```

## API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/users` - User management
- `/api/schools` - School management
- `/api/students` - Student management
- `/api/assessments` - Assessment operations
- `/api/mentoring` - Mentoring visits
- `/api/reports` - Reporting endpoints

## Default Credentials

For development, use:
- Email: admin@tarlpratham.org
- Password: admin123

## License

Private - All rights reserved