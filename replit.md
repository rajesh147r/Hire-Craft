# AI Resume Builder

## Overview

This is a full-stack AI-powered resume builder application that helps users create, optimize, and analyze their resumes for specific job applications. The system combines traditional resume building features with AI-powered job analysis, ATS optimization, and GitHub integration to provide personalized recommendations for improving job application success rates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with structured error handling and request logging
- **Development**: Hot reload with Vite middleware integration
- **Build**: esbuild for server bundling, separate from client build

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive user profiles including education, experience, projects, and job analyses
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting

### AI Integration
- **Provider**: OpenAI GPT-4o for job analysis and resume optimization
- **Features**: 
  - Job requirement analysis against user skills
  - ATS keyword extraction and scoring
  - Personalized improvement recommendations
  - Resume content optimization for specific job postings

### External Services
- **GitHub Integration**: Octokit for fetching user repositories and project suggestions
- **PDF Generation**: Custom PDF generation using jsPDF for resume exports
- **Session Management**: PostgreSQL session store for user persistence

### Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Component Architecture**: Reusable UI components with consistent design patterns
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Data Validation**: Zod schemas for runtime type checking and validation

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **AI Service**: OpenAI API for GPT-4o integration
- **GitHub API**: Octokit REST client for repository access

### UI Framework
- **Component Library**: Radix UI primitives for accessibility
- **Design System**: shadcn/ui components built on Radix
- **Icons**: Lucide React for consistent iconography
- **PDF Generation**: jsPDF for client-side PDF creation

### Development Tools
- **Build Tools**: Vite for frontend, esbuild for backend
- **Validation**: Zod for schema validation and type inference
- **Forms**: React Hook Form with Hookform resolvers
- **Styling**: Tailwind CSS with PostCSS processing

### Session and State Management
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Client State**: TanStack Query for server state caching and synchronization
- **Form State**: React Hook Form for complex form management