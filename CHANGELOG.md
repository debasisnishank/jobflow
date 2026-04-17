# Changelog

> **Version History:** This changelog documents all major changes, new features, and improvements made to CareersHUB. All changes are backward compatible unless otherwise noted.

## Version 2.0.1 - Patch Release (January 30, 2026)

### 🚀 New Features

#### AI-Powered Resume Parsing
- **Structured Output Parser:** Complete rewrite of resume parser using OpenAI's structured output with Zod schemas
- **Vision-Based Extraction:** Leverages GPT-4o vision capabilities to extract data from PDF images when text is corrupted
- **Guaranteed JSON Output:** Ensures valid, type-safe resume data extraction
- **Comprehensive Debugging:** Added extensive logging and file saving for troubleshooting
- **Fallback Date Handling:** Implements fallback logic for invalid dates to ensure work experiences are always saved

#### AI Usage Tracking Enhancement
- **Billing Integration:** Integrated AI usage tracking with billing system for accurate usage reporting
- **Toolbox Usage Tracking:** Added usage tracking for LinkedIn Headline and all AI Toolbox features
- **Automatic Tracking:** Usage automatically recorded when AI features are used
- **Monthly Reset:** Usage counters reset monthly for subscription limits

### 🎥 Video Interview Improvements

#### Video Playback Reliability
- **Enhanced Autoplay:** Added retry logic and multiple event listeners for reliable video autoplay
- **Dedicated Playback Effect:** Separated video playback logic for better stream management
- **Video Mirroring:** Implemented video mirroring for better user experience
- **Debug Overlay:** Added debug overlay with force play button for troubleshooting (removed in production)

#### Mock Interview Enhancements
- **Improved AI Feedback:** Enhanced AI-powered feedback generation for mock interviews
- **Better Question Generation:** Refined question generation based on job descriptions and scenarios
- **UI Refinements:** Improved dashboard responsiveness and overall UI layouts

### 🤖 AI Model Updates

- **GPT-4o-mini as Default:** Set GPT-4o-mini as the new default AI model for better performance and cost efficiency
- **Removed GPT-3.5-turbo:** Deprecated GPT-3.5-turbo in favor of newer models
- **AI Configuration Refinements:** Updated AI configurations across all features
- **Resume Skill Handling:** Improved skill extraction and handling in resume parser

### 🐛 Bug Fixes

#### Resume Features
- **Resume Review Fixed:** Fixed issue where resume review returned static error about missing information
  - Added database query to fetch full resume with all relations before AI review
  - Ensures ContactInfo, ResumeSections, Skills, and other nested data are properly loaded
- **PDF Export Fixed:** Resolved issue where PDF export was cutting off content
  - Removed height constraints and overflow restrictions
  - Changed `overflow-hidden` to `overflow-visible` for full content capture
  - All resume sections now included in PDF export
- **Resume Display Fixed:** Fixed excessive padding causing page scrolling
  - Reduced margins to 0.2in (left/right) and 0.25in (top/bottom)
  - Removed `py-4` padding from preview container
  - Resume now fits properly on page without scrolling

#### AI Toolbox
- **Usage Tracking Fixed:** LinkedIn Headline and other AI Toolbox features now properly track usage
  - Added `incrementAIUsage` call to `saveAIToolboxHistory` function
  - Updated LinkedIn headline route to save history and track usage
  - Billing page now shows accurate usage counts

### ⚡ Performance Improvements

- **Optimized Resume Parsing:** Hybrid approach using both text extraction and visual analysis
- **Efficient Database Queries:** Added proper includes for resume relations to reduce query count
- **Streaming Responses:** Maintained streaming for real-time AI responses

### 🔧 Technical Improvements

#### Code Quality
- **Type Safety:** Enhanced Zod schemas for resume data validation
- **Error Handling:** Improved error handling in resume parser and AI routes
- **Logging:** Added comprehensive logging for debugging AI features
- **Code Organization:** Better separation of concerns in video interview components

#### Database Schema
- **AiUsage Model:** Leveraged existing `AiUsage` model for tracking feature usage
- **Usage Period Tracking:** Implemented period-based usage tracking (YYYY-MM format)

#### API Enhancements
- **Resume Review API:** Enhanced to fetch full resume data before AI processing
- **AI Toolbox APIs:** All toolbox routes now track usage properly
- **Cover Letter API:** Added usage tracking integration

### 📝 Documentation

- **Debug Files:** Resume parser saves debug files for troubleshooting:
  - `/tmp/resume-parser-debug/extracted-text-{timestamp}.txt`
  - `/tmp/resume-parser-debug/page-{n}-{timestamp}.png`
  - `/tmp/resume-parser-debug/parsed-response-{timestamp}.json`

### 🔐 Security & Validation

- **Input Validation:** Enhanced validation for resume data and AI inputs
- **Fallback Logic:** Implemented safe fallbacks for invalid data to prevent data loss

## Version 2.0.0 - Final Release (January 20, 2026)

### 🚀 New Features

#### User Authentication & Management
- **Email Verification:** Implemented complete email verification process for user accounts to ensure security
- **Enhanced Sign-out Flow:** Streamlined authentication actions and improved error handling
- **Admin Navigation:** Added direct link to user dashboard from AdminSidebar for better navigation

#### AI & Resume Management
- **Mock Interview Enhancements:** Improved mock interview functionality and UI components
- **Resume Management:** Enhanced AI tools for better resume processing
- **AI Configuration:** Comprehensive management features for AI settings



### 🎯 Major Features

#### AI Configuration Management
- **Edit Config Button Fix:** Fixed issue where "Edit Config" button in AI Configuration page wasn't switching to edit tab
- **Tab Navigation:** Implemented controlled tab state to automatically switch to edit view when selecting a config
- **OpenAI Models Update:** Added all current OpenAI models (20 models) to backend and frontend:
  - GPT-5 series: `gpt-5.2`, `gpt-5.2-pro`, `gpt-5`, `gpt-5-mini`, `gpt-5-nano`
  - GPT-4.1 series: `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`
  - O-series reasoning models: `o3`, `o3-mini`, `o3-pro`, `o3-deep-research`, `o4-mini`, `o1`, `o1-pro`
  - GPT-4o series: `gpt-4o`, `gpt-4o-mini`
  - Legacy models: `gpt-4-turbo`, `gpt-4o-mini`
- **Model Seeding:** Added "Update Models" button to refresh available models for all AI configs
- **Output Format Protection:** Removed output format field from edit form to prevent accidental changes that could break JSON-based features
- **Shared Type Definitions:** Consolidated AI config type definitions across all components for type safety

#### Global 404 Page & Error Handling
- **Global 404 Page:** Created application-wide 404 page at `/app/not-found.tsx` for consistent error handling
- **Route-Specific 404s:** Maintained route-specific 404 pages (e.g., pricing plans) with contextual messages
- **User-Friendly Error Pages:** Enhanced 404 pages with helpful navigation options (Go Home, Go Back)
- **Pricing Plan 404:** Added dedicated 404 page for missing pricing plans with seeding instructions

#### Pricing Plans Seeding
- **Seed API Endpoint:** Created `/api/admin/plans/seed` endpoint to initialize default pricing plans
- **Seed Button:** Added "Seed Default Plans" button on pricing admin page when no plans exist
- **Update Plans Button:** Added "Update Plans" button to refresh existing plans with default values
- **Automatic Plan Creation:** Seed endpoint creates/updates all three default plans (free, freshers, experience)

#### Custom Date Range Filter for Jobs
- **Custom Date Range Picker:** Added a new date range picker component allowing users to select any custom date range for filtering jobs
- **Duration Filters:** Enhanced duration filtering with options for:
  - All Time
  - Last 7 days
  - Last 30 days
  - Last 90 days
  - Custom Range (user-selected start and end dates)
- **Timezone Handling:** Fixed timezone conversion issues to ensure dates are correctly interpreted across different timezones
- **Date Range Display:** Visual date range picker with two-month calendar view and clear date formatting

#### Jobs API Caching & Performance
- **New Jobs API Endpoint:** Created `/api/jobs` endpoint with comprehensive caching support
- **Next.js Cache Integration:** Implemented `unstable_cache` with 60-second TTL and cache tags
- **HTTP Caching Headers:** Added `Cache-Control` headers for CDN and browser caching
- **Cache Invalidation:** Automatic cache invalidation when jobs are created, updated, deleted, or status changed
- **Database-Level Filtering:** Moved filtering logic to database queries for improved performance
- **Optimized Queries:** Reduced API response times with efficient database queries and caching

### 🔄 Database-Driven Configuration Migration

#### AppConfigContext Implementation
- **Dynamic App Configuration:** Added `AppConfigContext` for centralized app configuration management
- **Client-Side Configuration:** Context provides dynamic branding, colors, and app settings to all client components
- **Real-Time Updates:** Configuration updates reflect across all components without page refresh
- **LocalStorage Caching:** Implemented client-side caching with TTL to reduce API calls
- **Cross-Tab Synchronization:** Configuration changes sync across browser tabs using BroadcastChannel

#### Admin Authentication & Services
- **Admin Authentication Checks:** Implemented comprehensive admin role verification and access control
- **Admin Services:** Created dedicated admin services for configuration, plans, and user management
- **Role-Based Access Control (RBAC):** Enhanced middleware and API routes with proper admin role validation
- **Admin Panel Access:** Secure admin panel access with proper authentication and authorization
- **Admin User Management:** Added admin user management with role change confirmation dialogs

#### Stripe Price ID Migration
- **Database Storage:** Stripe Price IDs are now stored in and fetched from the database instead of environment variables
- **Admin Panel Management:** Stripe Price IDs can be configured and updated through the admin panel
- **Dynamic Checkout:** Checkout sessions now use Price IDs from the database, enabling runtime updates without code changes
- **Backward Compatibility:** System falls back to static config if database plans are unavailable

#### Pricing Plans Migration
- **Database-First Approach:** Subscription plans are now primarily fetched from the database
- **Landing Page Pricing:** Updated `PricingSection` component to fetch plans from `/api/plans` endpoint
- **Dynamic Plan Display:** All pricing displays now reflect real-time database values
- **FAQ Integration:** FAQ page now dynamically fetches free plan limits from the database
- **Consistent Data Source:** All user-facing components now use the same database-driven pricing data
- **Component Refactoring:** Refactored various components to utilize AppConfigContext for dynamic configuration

#### Dynamic Branding Updates
- **Privacy Page:** Updated privacy page to fetch brand name and support email from database
- **Terms Page:** Updated terms page to use dynamic app configuration
- **Consistent Configuration:** All static pages now use dynamic app configuration from database
- **Context Integration:** Components now use AppConfigContext for consistent branding across the application

### 🐛 Bug Fixes

- **Fixed Duplicate Import:** Resolved duplicate `revalidateTag` import in `job.actions.ts`
- **Fixed Date Range Filtering:** Corrected timezone conversion issues causing incorrect date filtering
- **Fixed Cache Key Collisions:** Updated cache keys to include all filter parameters for proper cache differentiation
- **Fixed Partial Date Range Handling:** Backend now properly handles cases where only start date or end date is provided
- **Fixed AI Config Edit Button:** Resolved issue where clicking "Edit Config" didn't navigate to edit tab
- **Fixed Type Mismatches:** Resolved TypeScript type errors in AI config components by consolidating interface definitions
- **Fixed Regex Parsing Error:** Fixed TypeScript error in prompt validation regex patterns by splitting complex alternations

### ⚡ Performance Improvements

- **Jobs List Caching:** Implemented comprehensive caching for jobs list API with 60-second TTL
- **Cache Invalidation Strategy:** Added `revalidateTag("jobs")` to all job mutation operations
- **Reduced Database Queries:** Caching significantly reduces database load for frequently accessed job lists
- **Optimized Date Filtering:** Date range filtering now performed at database level for better performance

### 🔧 Technical Improvements

#### Code Quality
- **Removed Static Dependencies:** Migrated from static `SUBSCRIPTION_PLANS` to dynamic database fetching
- **Improved Error Handling:** Enhanced error handling across admin features and API interactions
- **Streamlined API Interactions:** Optimized API calls for admin features with better error handling
- **Type Safety:** Enhanced TypeScript types for date range filtering and app configuration
- **Component Refactoring:** Updated client components to use API endpoints and AppConfigContext instead of static imports
- **Centralized Configuration:** AppConfigContext provides single source of truth for app configuration
- **Shared Type Definitions:** Consolidated AI config interfaces across components to prevent type mismatches
- **Prisma Schema Updates:** Updated `availableModels` default to include all current OpenAI models
- **Error Page Standardization:** Implemented consistent 404 error handling across the application

#### API Enhancements
- **New Jobs Endpoint:** `/api/jobs` endpoint with support for:
  - Pagination
  - Status filtering
  - Duration filtering (7, 30, 90 days, all time)
  - Custom date range filtering
  - Search functionality
- **Cache Tag System:** Implemented cache tags for efficient cache invalidation
- **Query Parameter Support:** Enhanced query parameter handling for flexible filtering

### 📝 Component Updates

#### New Components
- **DateRangePicker:** New reusable component for selecting custom date ranges
  - Two-month calendar view
  - Range selection support
  - Clear visual feedback
  - Timezone-aware date handling

#### Updated Components
- **JobsContainerHeader:** Added duration filter dropdown and custom date range picker
- **PricingSection:** Migrated to fetch plans from API with loading states
- **FAQPageContent:** Updated to fetch free plan limits dynamically
- **PrivacyPage:** Updated to fetch app configuration from database

### 🔐 Security & Validation

- **Input Validation:** Enhanced validation for date range parameters
- **SQL Injection Prevention:** All date filtering uses parameterized queries
- **Cache Security:** Cache keys include user ID to prevent data leakage between users

### 📊 Database Schema

No schema changes required for this version. All changes are backward compatible.

## Version 1.0 - Major Update (December 2024)

###  Complete Application Redesign

> **Major UI/UX Overhaul:** The entire application has been redesigned with a modern, professional interface.

- **Modern Design System:** Complete redesign using Tailwind CSS and Shadcn/ui components
- **Improved Navigation:** Enhanced sidebar with nested navigation support for better organization
- **Responsive Layout:** Fully responsive design optimized for desktop, tablet, and mobile devices
- **Better Visual Hierarchy:** Improved spacing, typography, and color scheme throughout the application
- **Enhanced Dashboard:** Redesigned dashboard with better data visualization and user experience
- **Improved Forms:** Better form layouts with improved validation and error handling
- **Consistent Styling:** Unified design language across all pages and components
- **Better Loading States:** Improved loading indicators and skeleton screens
- **Enhanced Cards & Components:** Modern card designs with better shadows and hover effects
- **Improved Mobile Menu:** Enhanced mobile navigation with support for nested menu items

###  New Features

####  AI Toolbox Suite

A comprehensive suite of AI-powered tools to help users enhance their professional presence:

- **Personal Brand Statement Generator:** Create compelling personal brand statements that highlight unique value propositions
- **Email Writer:** Generate professional emails for networking, follow-ups, and job inquiries
- **Elevator Pitch Generator:** Craft concise and impactful elevator pitches for networking events and interviews
- **LinkedIn Headline Generator:** Create attention-grabbing LinkedIn headlines that optimize profile visibility
- **LinkedIn About Section Generator:** Generate engaging LinkedIn "About" sections that tell professional stories
- **LinkedIn Post Generator:** Create professional LinkedIn posts to showcase expertise and engage networks

**Features:**
- All AI Toolbox tools have individual usage limits per subscription plan
- Usage history tracking for all AI Toolbox requests
- Copy-to-clipboard functionality for generated content
- Streaming responses for real-time content generation
- Error handling with user-friendly messages

####  Mock Interview System

A comprehensive mock interview system with AI-powered question generation:

- **15+ Interview Scenarios:** Predefined interview scenarios covering various job roles and interview types:
  - Technical Interviews (Software Engineering, Frontend, Backend, DevOps, AI/ML, etc.)
  - Behavioral Interviews
  - Negotiations
  - Screening Interviews
  - Situational Interviews
  - Case Studies
  - Leadership Interviews
  - Cultural Fit Assessments
  - Career Development
  - Exit Interviews
  - Industry-Specific Interviews
  - Challenge-Based Interviews
- **AI-Powered Question Generation:** Dynamic question generation based on selected scenario and job description
- **Follow-up Questions:** AI generates contextual follow-up questions based on user responses
- **Session Management:** Track and review past mock interview sessions
- **Resume Integration:** Use resumes to provide context for more relevant interview questions
- **Job Integration:** Link mock interviews to specific job applications for targeted practice
- **Scenario Templates:** System prompts optimized for each interview scenario type

####  Enhanced Billing & Usage Dashboard

- **Comprehensive Usage Statistics:** Detailed breakdown of feature usage across all plans
- **Feature-Specific Tracking:** Individual tracking for each AI Toolbox tool, AI Resume features, and Mock Interviews
- **Storage Usage Display:** Visual representation of storage usage with detailed breakdown
- **Plan Comparison:** Quick comparison of all subscription plans with upgrade options
- **Remaining Credits Display:** Clear visibility of remaining usage for each feature
- **Usage History:** Track usage over time with monthly resets

####  Dedicated Landing Pages

- **Features Page:** Comprehensive page showcasing all application features
- **Pricing Page:** Detailed pricing page with feature breakdowns and plan comparisons
- **FAQ Page:** Frequently Asked Questions with search and category filtering
- **About Page:** About us page with mission, values, and statistics
- **Contact Page:** Contact form with email integration and confirmation

####  Networking & Contacts

- **Contact Management:** Comprehensive contact management system
- **Networking Tracking:** Track networking activities and interactions
- **Contact Details:** Detailed contact information with activity history

###  Subscription System Overhaul

#### Dynamic Pricing System

- **Environment Variable Configuration:** All plan prices and limits can be configured via environment variables
- **No Code Changes Required:** Update pricing and limits without modifying code
- **Runtime Configuration:** System reads configuration at runtime from environment variables
- **Default Values:** Sensible defaults provided if environment variables are not set

#### Feature-Specific Limits

The subscription system now tracks usage for individual features rather than generic AI requests:

- **AI Toolbox Tools:** Individual limits for each of the 6 AI Toolbox tools
- **AI Resume Features:** Separate limits for Resume Review, Job Matching, and Cover Letter Generation
- **Mock Interviews:** Dedicated limit for Mock Interview sessions
- **Core Features:** Limits for Jobs, Resumes, and Storage

#### Stripe Price ID Integration

- **Stripe Price ID Support:** Integration with Stripe Price IDs for seamless checkout
- **Environment Variable Configuration:** Configure Price IDs via `STRIPE_PRICE_ID_FRESHERS` and `STRIPE_PRICE_ID_EXPERIENCE`
- **Automatic Price Retrieval:** System automatically retrieves Price IDs from environment variables
- **Error Handling:** Clear error messages if Price IDs are not configured

#### Usage Tracking System

- **Automatic Usage Tracking:** System automatically tracks feature usage in the database
- **Monthly Resets:** Usage counters reset automatically at the start of each month
- **Per-Feature Tracking:** Individual usage tracking for each feature type
- **Database-Driven:** All usage data stored in MongoDB for accurate tracking

#### Feature Access Control

- **Centralized Validation:** New `feature-access-control.ts` module for centralized feature validation
- **Higher-Order Function:** `withFeatureProtection` HOF for easy API route protection
- **Automatic Credit Deduction:** Credits are automatically deducted when features are used
- **Standardized Error Responses:** Consistent error messages for access denied scenarios
- **Usage Validation:** Validates usage against plan limits before allowing feature access

###  Dynamic Branding & Configuration

#### Brand Name Customization

- **Environment Variable Support:** Brand name configurable via `NEXT_PUBLIC_BRAND_NAME`
- **Logo Customization:** Logo path configurable via `NEXT_PUBLIC_LOGO_PATH`
- **Dynamic Metadata:** All page titles and metadata use dynamic brand name
- **Consistent Branding:** Brand name used throughout the application automatically

#### Dynamic Favicon System

- **Custom Favicon Support:** Support for custom favicon files via `NEXT_PUBLIC_FAVICON_PATH`
- **Letter-Based Fallback:** Dynamic letter-based favicon generation if no custom file is provided
- **Configurable Appearance:** Favicon appearance configurable via environment variables:
  - `NEXT_PUBLIC_FAVICON_LETTER` - Letter to display
  - `NEXT_PUBLIC_FAVICON_FONT_SIZE` - Font size
  - `NEXT_PUBLIC_FAVICON_BORDER_RADIUS` - Border radius
  - `NEXT_PUBLIC_FAVICON_TEXT_COLOR` - Text color
  - `NEXT_PUBLIC_FAVICON_GRADIENT_START` - Gradient start color
  - `NEXT_PUBLIC_FAVICON_GRADIENT_END` - Gradient end color
- **Apple Touch Icon:** Dynamic Apple touch icon generation with same configuration options

#### Environment Variable Configuration

The application is now fully configurable via environment variables:

- **Subscription Plans:** All plan prices, limits, and Stripe Price IDs
- **Branding:** Brand name, logo, and favicon
- **API Keys:** OpenAI, Stripe, and other service API keys
- **Database:** MongoDB connection string
- **Application URLs:** Base URLs for redirects and callbacks

###  Technical Improvements

#### Code Quality Enhancements

- **Type Safety:** Removed all `any` types, improved TypeScript type definitions
- **Error Handling:** Standardized error handling with proper type checking (`error: unknown`)
- **Centralized Error Handler:** New `api-error-handler.ts` for consistent API error responses
- **Code Deduplication:** Created shared hooks and utilities to eliminate code duplication
- **Streaming Response Hook:** New `useStreamingResponse.ts` hook for handling streaming API responses
- **Removed Strict Mode:** Removed unnecessary `"use strict"` directives
- **Improved Type Definitions:** Better type definitions for form handlers and controllers
- **Constants Extraction:** Extracted magic numbers and strings to constants

#### Database Schema Updates

- **AIToolboxHistory Model:** New model for tracking AI Toolbox usage history
- **MockInterviewSession Updates:** Added `scenarioId` field for scenario tracking
- **User Model Updates:** Added `subscriptionPlan`, `stripeCustomerId`, and `stripeSubscriptionId` fields
- **Resume Relations:** Added relation between Resume and AIToolboxHistory

#### API Route Improvements

- **Feature Validation:** All API routes now include feature access validation
- **Standardized Error Responses:** Consistent error response format across all routes
- **Usage Tracking Integration:** Automatic usage tracking in all feature API routes
- **Better Error Messages:** More descriptive error messages for better debugging

#### Component Improvements

- **Shared Layout Components:** Created reusable layout components for AI Toolbox tools
- **Improved Form Components:** Better type safety and validation in form components
- **Enhanced Select Component:** Improved type definitions for better TypeScript support
- **Loading Component Updates:** Added color prop for better visibility on different backgrounds

###  Documentation Updates

- **Comprehensive Pricing Guide:** Updated pricing documentation with dynamic system details
- **Environment Variables Guide:** Complete guide for all environment variables
- **Feature Documentation:** Documentation for all new features (AI Toolbox, Mock Interviews)
- **Configuration Examples:** Examples for configuring plans, limits, and branding
- **Troubleshooting Guides:** Enhanced troubleshooting sections

###  Bug Fixes

- Fixed sidebar scrolling issues
- Fixed modal overflow issues in upload dialogs
- Fixed error message display in resume upload
- Fixed type errors in form components
- Fixed streaming response type issues
- Fixed Prisma query type mismatches
- Fixed authentication redirect issues
- Fixed loading spinner visibility on auth pages

###  Performance Improvements

- Optimized database queries with proper includes
- Improved streaming response handling
- Better error handling to prevent unnecessary API calls
- Optimized component rendering

###  Security Enhancements

- Improved authentication flow with callback URL preservation
- Better validation of user permissions
- Enhanced error handling to prevent information leakage
- Secure environment variable handling

## Migration Guide

> **Important:** If you're upgrading from a previous version, follow these steps:

### 1. Environment Variables

Add the new environment variables to your `.env.local` file. See the [Environment Variables](./env-setup.html) guide for the complete list.

### 2. Database Migration

Run Prisma migrations to update your database schema:

```bash
npx prisma db push
# or
npx prisma migrate dev
```

### 3. Stripe Price IDs

Create products and prices in your Stripe Dashboard, then add the Price IDs to your environment variables.

### 4. Brand Configuration

Configure your brand name and logo via environment variables if you want to customize them.

### 5. Test Features

Test all new features (AI Toolbox, Mock Interviews) to ensure they're working correctly with your configuration.

## Breaking Changes

> **Note:** This version maintains backward compatibility. However, some configuration changes are recommended:

- **Subscription Plans:** The subscription system now uses environment variables. Old hardcoded values will still work but are deprecated.
- **API Routes:** All feature API routes now require proper authentication and plan validation.
- **Database Schema:** New fields added to User and MockInterviewSession models. Run migrations to update.

## Future Roadmap

- Team member functionality (currently reserved in schema)
- Additional AI Toolbox tools
- More interview scenarios
- Advanced analytics and reporting
- Integration with job boards
- Mobile app development

---

[Back to Documentation](./index.html) | [Environment Setup](./env-setup.html)
