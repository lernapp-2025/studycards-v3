# StudyCards - Professional Flashcard Learning App

StudyCards is a comprehensive, GDPR-compliant flashcard application built for students and professionals in Europe. It features real-time collaboration, gamification, and a one-time payment model (€7.99) with a 7-day free trial.

## 🚀 Features

### Core Functionality
- **WYSIWYG Card Editor**: Rich text editing with images, formatting, and drag-and-drop positioning
- **Hierarchical Folders**: Unlimited depth, color-coded organization (8 pastel colors)
- **5 Learning Modes**: 
  - Flashcards (classic flip cards)
  - Learn Mode (spaced repetition)
  - Write Mode (type answers)
  - Test Mode (multiple choice, true/false)
  - Match Mode (matching game with timing)

### Collaboration & Social
- **Groups**: Up to 15 private groups per user
- **Real-time Editing**: Google Docs-style collaboration
- **Sharing**: Public read-only links for sets and folders
- **Group Chat**: Simple messaging for coordination

### Gamification
- **XP & Levels**: Progress tracking with experience points
- **Badges**: 8 unique achievements (Kartenguru, Quiz-Master, etc.)
- **Streaks**: Daily study streak tracking
- **Statistics**: Comprehensive learning analytics

### Technical Features
- **GDPR Compliant**: EU servers, minimal data collection
- **Multi-language**: German and English support
- **Dark/Light Mode**: Theme switching
- **Mobile Responsive**: Works on all devices
- **Offline Ready**: PWA capabilities

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with app router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **TipTap** - Rich text editor for cards
- **DND Kit** - Drag and drop functionality

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Built-in data protection
- **Edge Functions** - Serverless API endpoints

### Authentication & Payments
- **Supabase Auth** - Email/password authentication
- **Stripe** - One-time payment processing (€7.99)
- **Webhook Handling** - Automated subscription management

### Deployment
- **Vercel** - Frontend hosting with edge functions
- **Supabase Cloud** - Database and storage hosting

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/studycards-v3.git
cd studycards-v3
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_PROJECT_REF=your-project-ref

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PRICE_ID=price_your-price-id

# Email Configuration
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the migration:
```bash
supabase db reset
```
3. Apply the schema from `supabase/migrations/001_initial_schema.sql`

### 5. Stripe Setup
1. Create a product in Stripe Dashboard
2. Set price to €7.99 one-time payment
3. Configure webhooks for your domain
4. Copy the price ID to your environment variables

### 6. Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Supabase Database Schema
The application uses the following main tables:
- `users` - User profiles with trial/premium status
- `folders` - Hierarchical folder structure
- `card_sets` - Collections of flashcards
- `flashcards` - Individual cards with front/back content
- `groups` - Collaboration groups
- `group_memberships` - Group membership relationships
- `user_badges` - Achievement tracking
- `study_sessions` - Learning session analytics

### Color System
StudyCards uses 8 predefined pastel colors for folders:
- `#7EC4FF` - Blue
- `#6EE7B7` - Green  
- `#FFF58F` - Yellow
- `#FFD085` - Orange
- `#FF8FA3` - Pink
- `#BFA7FF` - Purple
- `#60EFFF` - Turquoise
- `#FF8787` - Red

### Limits & Constraints
- **Folders**: 20 per level, unlimited depth (max 10 levels)
- **Cards**: 100 per set
- **Groups**: 15 per user, unlimited members
- **File Size**: 5MB max for images
- **Trial**: 7 days from registration
- **Price**: €7.99 one-time payment

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Production
1. Create production Supabase project
2. Update environment variables
3. Configure custom domain if needed

### Domain & SSL
Configure your custom domain in Vercel and update:
- Stripe webhook endpoints
- Supabase redirect URLs
- Email service settings

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/reset-password` - Password reset

### Data Endpoints
- `GET /api/folders` - Get user folders
- `POST /api/folders` - Create new folder
- `GET /api/sets/:id` - Get card set with cards
- `POST /api/sets` - Create new card set
- `PUT /api/cards/:id` - Update flashcard

### Payment Endpoints
- `POST /api/stripe/create-checkout` - Create payment session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 🧪 Testing

### Unit Tests
```bash
npm run test
# or
yarn test
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## 📊 Performance Monitoring

The application includes built-in analytics for:
- User engagement metrics
- Study session tracking
- Performance monitoring
- Error tracking

## 🔒 Security Features

### Data Protection
- Row Level Security (RLS) on all tables
- Input validation and sanitization
- XSS protection
- CSRF protection

### Privacy Compliance
- GDPR compliant data handling
- User data export/deletion
- Cookie consent management
- Minimal data collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Add JSDoc comments for functions
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@studycards.com
- Documentation: [docs.studycards.com](https://docs.studycards.com)
- Issues: [GitHub Issues](https://github.com/your-username/studycards-v3/issues)

## 📈 Roadmap

### Planned Features
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] AI-powered study recommendations
- [ ] Additional language support
- [ ] Voice recordings for cards
- [ ] Handwriting recognition
- [ ] Advanced sharing permissions
- [ ] Study schedule optimization

### Known Issues
- Mobile keyboard handling needs optimization
- Some animations may be slow on older devices
- Large image uploads may timeout on slow connections

---

Built with ❤️ for students and learners everywhere.