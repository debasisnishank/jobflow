# JobFlow - Job Search Assistant

## Live Demo

Try JobFlow in action: **[https://jobflow.app](https://jobflow.app)**

---

## About JobFlow

JobFlow is a web application designed to help job seekers efficiently track and organize their job applications.

### Why JobFlow?

- **All-in-One Solution:** Track applications, manage resumes, and leverage AI-powered insights in one place
- **Credit-Based System:** Flexible credit-based pricing model for accessing features
- **AI-Powered:** Get resume reviews, job matching scores, and personalized recommendations
- **Easy Setup:** Quick installation and configuration

---

## Key Features

### Application Tracking
Keep a detailed record of all your job applications with:
- Company information and job titles
- Application dates and deadlines
- Current status tracking (Draft, Applied, Interview, Offer, Rejected, Expired, Archived)
- Job descriptions and requirements
- Source tracking (where you found the job)

### Activity Dashboard
Visualize your job search progress with:
- Weekly application charts
- Activity calendar view
- Company statistics and trends
- Goal progress tracking
- Recent applications overview

### Resume Management
Store and organize multiple resumes:
- Upload and manage multiple resume versions
- Structured resume builder with sections
- File upload support for existing resumes
- AI-powered resume review and improvement suggestions

### AI Assistant
Leverage OpenAI to enhance your job search:
- **Resume Review:** Get detailed feedback on your resume including strengths, weaknesses, and ATS compatibility
- **Job Matching:** Compare your resume against job descriptions to get match scores and identify best-fit opportunities
- **Cover Letter Generation:** Generate personalized cover letters tailored to each job application

### Advanced Features
- Activity logging with time tracking
- Company and location management
- Job source tracking
- Credit plans (Free, Freshers $29/month, Experience $99/month)
- Mobile-responsive design

---

## Installation

### Prerequisites

Before you begin, make sure you have:
- **Node.js 18+** installed
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

---

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```


### Step 2: Create .env file
```bash
cp .env.example .env
npx prisma db push
```

### Step : Run Development Server

```bash
npm run dev
```

### Step 5: Access the Application

Open http://localhost:3000 in your browser.

---

## Environment Variables Explained

## AI Integration

JobFlow uses **OpenAI** for all AI-powered features. To enable these features, you must add your OpenAI API key.

### Supported Features
- Resume review and analysis
- Job matching with compatibility scores
- Cover letter generation

### Setting Up OpenAI

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
```

### Available Models

- **gpt-4o-mini** (default, cost-effective)
- **gpt-4o** (recommended for better quality)
- Additional models can be configured in the AI Settings page

### Usage Tips

- Ensure resume and job description content doesn't contain special characters
- Keep input content within the model's context length (~3000 tokens)
- Avoid including unnecessary details in job descriptions for optimal results

---

## Credit Plans

Jobflow offers three credit plan tiers:

### Free Plan
- 10 job applications
- 1 resume
- 5 AI requests per month
- 5MB storage

### Freshers Plan - $29/month
- 50 job applications
- 5 resumes
- 50 AI requests per month
- 20MB storage

### Experience Plan - $99/month
- 500 job applications
- 20 resumes
- Unlimited AI requests
- 100MB storage

*Note: Credit plan features require Stripe integration.*

---

## Project Structure

```
jobflow/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/      # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   └── api/         # API routes
│   ├── components/      # React components
│   ├── lib/            # Utility libraries
│   └── models/         # TypeScript models
├── prisma/             # Database schema
└── public/             # Static assets
```

---

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can change it by setting the PORT environment variable:
```bash
PORT=3001 npm run dev
```

### Database Connection Issues
- Check that MongoDB is running
- Verify `DATABASE_URL` is correct in your environment variables
- Test MongoDB connection using MongoDB Compass or mongo shell

### AI Features Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check your OpenAI account has credits available
- Review the API usage in your OpenAI dashboard

### Authentication Issues
- Ensure `AUTH_SECRET` and `NEXTAUTH_SECRET` are set
- Verify `NEXTAUTH_URL` matches your application URL
- Check Google OAuth credentials if using Google sign-in

---

## Documentation

For detailed documentation, including:
- User guides
- Deployment instructions (Vercel, AWS EC2)
- Frontend customization
- API configuration
- And more...


---

## License

This project is available for use.

---

## Credits

JobFlow is built with amazing technologies:

- **React** - UI library
- **Next.js** - React framework
- **Shadcn/ui** - UI components
- **Prisma** - Database ORM
- **Tailwind CSS** - Styling
- **MongoDB** - Database
- **OpenAI** - AI capabilities
- **LangChain** - AI framework
- **Tiptap** - Rich text editor
- **Nivo** - Data visualization

---

## Important Note

**Current Status:** JobFlow has been tested primarily in local environments. While it can be deployed to remote servers, it's recommended to thoroughly test all features in your specific environment before production use.

---

## Support

- **Live Demo:** Try the application at [jobflow.app](https://jobflow.app)
- **Documentation:** Check the [documentation folder](./document/) for detailed guides

---

**Made with care for job seekers everywhere**

*Happy job hunting!*
