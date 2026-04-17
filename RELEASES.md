# Release Notes

###  Initial Release

This is the first major release of Jobflow, featuring a complete redesign and comprehensive feature set.

###  New Features

#### AI Toolbox Suite
- **Personal Brand Statement Generator** - Create compelling personal brand statements
- **Email Writer** - Generate professional emails for networking and job inquiries
- **Elevator Pitch Generator** - Craft concise and impactful elevator pitches
- **LinkedIn Headline Generator** - Create attention-grabbing LinkedIn headlines
- **LinkedIn About Section Generator** - Generate engaging LinkedIn "About" sections
- **LinkedIn Post Generator** - Create professional LinkedIn posts

**Features:**
- Individual usage limits per subscription plan for each tool
- Usage history tracking for all AI Toolbox requests
- Copy-to-clipboard functionality for generated content
- Streaming responses for real-time content generation
- User-friendly error handling

#### Mock Interview System
- **15+ Interview Scenarios** covering:
  - Technical Interviews (Software Engineering, Frontend, Backend, DevOps, AI/ML, Data Science, QA, Security, Cloud)
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
- AI-powered question generation based on selected scenario and job description
- Contextual follow-up questions based on user responses
- Session management to track and review past mock interview sessions
- Resume and job integration for targeted practice
- Optimized system prompts for each interview scenario type

#### Enhanced Billing & Usage Dashboard
- Comprehensive usage statistics with detailed breakdown across all plans
- Feature-specific tracking for each AI Toolbox tool, AI Resume features, and Mock Interviews
- Visual representation of storage usage with detailed breakdown
- Quick plan comparison with upgrade options
- Clear visibility of remaining usage for each feature
- Usage history tracking with monthly resets

#### Dedicated Landing Pages
- **Features Page** - Comprehensive showcase of all application features
- **Pricing Page** - Detailed pricing with feature breakdowns and plan comparisons
- **FAQ Page** - Frequently Asked Questions with search and category filtering
- **About Page** - Mission, values, and statistics
- **Contact Page** - Contact form with email integration and confirmation

#### Networking & Contacts
- Comprehensive contact management system
- Networking activity tracking
- Detailed contact information with activity history

###  Subscription System

#### Dynamic Pricing System
- All plan prices and limits configurable via environment variables
- No code changes required to update pricing
- Runtime configuration from environment variables
- Sensible default values if environment variables are not set

#### Feature-Specific Limits
- Individual limits for each of the 6 AI Toolbox tools
- Separate limits for Resume Review, Job Matching, and Cover Letter Generation
- Dedicated limit for Mock Interview sessions
- Limits for Jobs, Resumes, and Storage

#### Stripe Integration
- Stripe Price ID support for seamless checkout
- Environment variable configuration via `STRIPE_PRICE_ID_FRESHERS` and `STRIPE_PRICE_ID_EXPERIENCE`
- Automatic Price ID retrieval from environment variables
- Clear error messages if Price IDs are not configured

#### Usage Tracking System
- Automatic feature usage tracking in the database
- Monthly usage counter resets
- Per-feature usage tracking
- Database-driven tracking stored in MongoDB

#### Feature Access Control
- Centralized validation via `feature-access-control.ts` module
- `withFeatureProtection` HOF for easy API route protection
- Automatic credit deduction when features are used
- Standardized error responses for access denied scenarios
- Usage validation against plan limits before feature access

###  Dynamic Branding & Configuration

#### Brand Customization
- Brand name configurable via `NEXT_PUBLIC_BRAND_NAME`
- Logo path configurable via `NEXT_PUBLIC_LOGO_PATH`
- Dynamic metadata using brand name throughout
- Consistent branding across the application

#### Dynamic Favicon System
- Custom favicon support via `NEXT_PUBLIC_FAVICON_PATH`
- Letter-based fallback if no custom file is provided
- Configurable appearance via environment variables:
  - `NEXT_PUBLIC_FAVICON_LETTER` - Letter to display
  - `NEXT_PUBLIC_FAVICON_FONT_SIZE` - Font size
  - `NEXT_PUBLIC_FAVICON_BORDER_RADIUS` - Border radius
  - `NEXT_PUBLIC_FAVICON_TEXT_COLOR` - Text color
  - `NEXT_PUBLIC_FAVICON_GRADIENT_START` - Gradient start color
  - `NEXT_PUBLIC_FAVICON_GRADIENT_END` - Gradient end color
- Dynamic Apple touch icon generation

###  Complete Application Redesign

- Modern design system using Tailwind CSS and Shadcn/ui components
- Enhanced sidebar with nested navigation support
- Fully responsive design optimized for all devices
- Improved visual hierarchy with better spacing, typography, and color scheme
- Redesigned dashboard with better data visualization
- Improved form layouts with better validation and error handling
- Unified design language across all pages and components
- Better loading indicators and skeleton screens
- Modern card designs with better shadows and hover effects
- Enhanced mobile navigation with nested menu support

###  Technical Improvements

#### Code Quality
- Removed all `any` types, improved TypeScript type definitions
- Standardized error handling with proper type checking (`error: unknown`)
- Centralized error handler (`api-error-handler.ts`) for consistent API responses
- Code deduplication with shared hooks and utilities
- New `useStreamingResponse.ts` hook for handling streaming API responses
- Removed unnecessary `"use strict"` directives
- Improved type definitions for form handlers and controllers
- Extracted magic numbers and strings to constants

#### Database Schema
- New `AIToolboxHistory` model for tracking AI Toolbox usage history
- Added `scenarioId` field to `MockInterviewSession` for scenario tracking
- Added `subscriptionPlan`, `stripeCustomerId`, and `stripeSubscriptionId` fields to User model
- Added relation between Resume and AIToolboxHistory

#### API Routes
- Feature validation on all API routes
- Standardized error response format
- Automatic usage tracking in all feature API routes
- More descriptive error messages

#### Components
- Reusable layout components for AI Toolbox tools
- Improved form components with better type safety and validation
- Enhanced Select component with improved TypeScript support
- Loading component with color prop for better visibility

###  Documentation

- Comprehensive pricing guide with dynamic system details
- Complete environment variables guide
- Feature documentation for AI Toolbox and Mock Interviews
- Configuration examples for plans, limits, and branding
- Enhanced troubleshooting sections

###  Performance

- Optimized database queries with proper includes
- Improved streaming response handling
- Better error handling to prevent unnecessary API calls
- Optimized component rendering
- Database indexes for improved query performance

###  Security

- Improved authentication flow with callback URL preservation
- Better validation of user permissions
- Enhanced error handling to prevent information leakage
- Secure environment variable handling

###  Migration Notes

If upgrading from a previous version:

1. **Environment Variables**: Add new environment variables to `.env.local` (see [Environment Variables Guide](./env-setup.html))

2. **Database Migration**: Run Prisma migrations:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

3. **Stripe Price IDs**: Create products and prices in Stripe Dashboard, then add Price IDs to environment variables

4. **Brand Configuration**: Configure brand name and logo via environment variables if needed

5. **Test Features**: Test all new features (AI Toolbox, Mock Interviews) to ensure correct configuration

###  Breaking Changes

This version maintains backward compatibility. However, some configuration changes are recommended:

- **Subscription Plans**: The subscription system now uses environment variables. Old hardcoded values will still work but are deprecated.
- **API Routes**: All feature API routes now require proper authentication and plan validation.
- **Database Schema**: New fields added to User and MockInterviewSession models. Run migrations to update.

---

## [1.0.1] - 2024-12-XX

###  Bug Fixes

- Fixed sidebar scrolling issues - Sidebar navigation now properly scrollable
- Fixed modal overflow issues in upload dialogs - Content no longer overflows modal boundaries
- Fixed error message display in resume upload - Specific error messages now displayed correctly
- Fixed type errors in form components - Improved TypeScript type definitions
- Fixed streaming response type issues - Corrected type constraints for streaming hooks
- Fixed Prisma query type mismatches - Added proper includes for all relations
- Fixed authentication redirect issues - Production redirects now use correct domain
- Fixed loading spinner visibility on auth pages - Spinner now visible on dark backgrounds

###  Improvements

- Improved error message parsing in resume upload dialog
- Enhanced modal dialog overflow handling with proper scrolling
- Better type safety in form components and controllers

---

## [1.0.2] - 2024-12-XX

###  Bug Fixes

- Fixed production authentication redirect to use request origin instead of localhost
- Fixed sign-out redirect to use production URL instead of localhost
- Fixed dashboard performance issue by removing `force-dynamic` from root layout
- Fixed documentation color theme to use blue instead of green

###  Performance Improvements

- Removed `force-dynamic` from root layout to allow Next.js optimization
- Optimized dashboard page to fetch user once and pass userId to data functions
- Optimized `getAllFeatureUsage` to use aggregated queries instead of multiple individual queries
- Added database indexes for improved query performance:
  - Composite indexes on `Job` model (userId, applied, appliedDate)
  - Composite indexes on `Activity` model (userId, endTime, createdAt)
  - Composite indexes on `AIToolboxHistory` model (userId, toolType, createdAt)
  - Composite indexes on `MockInterviewSession` model (userId, createdAt)
  - Composite indexes on `CoverLetter` model (jobId, createdAt)
  - Composite indexes on `Resume` model (profileId, FileId)

###  Documentation

- Converted CHANGELOG from HTML to Markdown format
- Created comprehensive RELEASES.md file following semantic versioning

---

## [2.0.0] - 2026-01-20

### Final Release
This major release marks the final version of the application, incorporating all planned features and refinements. It introduces robust email verification, enhanced admin tools, and a fully database-driven configuration system.

### 🚀 New Features & Improvements

#### User Authentication
- **Email Verification:** Complete secure email verification flow for all users.
- **Sign-out Optimization:** Improved sign-out process and redirection logic.

#### Admin & Configuration
- **Database-Driven Config:** Dynamic configuration for pricing, AI models, and app settings.
- **Admin Navigation:** Enhanced sidebar with direct user dashboard access.
- **Global 404:** Unified error handling and custom 404 pages.

#### AI Tools
- **Mock Interview System:** Enhanced UI and functionality for interview practice.
- **Resume Capabilities:** Improved AI tools for resume analysis and generation.
- **AI Config Management:** comprehensive admin tools for AI model settings.

#### Performance
- **Jobs API Caching:** Implemented `unstable_cache` for high-performance job listings.
- **Optimized Queries:** Database-level filtering and efficient indexing.


## Version History

| Version | Release Date | Type | Description |
|---------|--------------|------|-------------|
| 2.0.0 | 2026-01-20 | Major | Final release with email verification, DB config, and AI enhancements |
| 1.0.2 | 2025-12-11 | Patch | Bug fixes and performance improvements |
| 1.0.1 | 2025-11-30 | Patch | Bug fixes and minor improvements |
| 1.0.0 | 2025-11-11 | Major | Initial release with complete redesign and all features |

---

## Upcoming Releases

### [1.1.0] - Planned

**New Features:**
- Team member functionality (currently reserved in schema)
- Additional AI Toolbox tools
- More interview scenarios
- Advanced analytics and reporting

### [1.2.0] - Planned

**New Features:**
- Integration with job boards
- Enhanced networking features
- Mobile app development

---

## Versioning Guidelines

When creating a new release, follow these guidelines:

### Patch Release (1.0.X)
- Bug fixes
- Security patches
- Performance improvements
- Documentation updates
- No new features
- No breaking changes

### Minor Release (1.X.0)
- New features
- New API endpoints
- New configuration options
- Backward compatible changes
- No breaking changes

### Major Release (X.0.0)
- Breaking changes
- Major API changes
- Significant architecture changes
- Requires migration guide
- May require database migrations

---

For detailed change history, see [CHANGELOG.md](./CHANGELOG.md).
