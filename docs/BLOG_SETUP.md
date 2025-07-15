# Blog Setup Instructions

## 🎉 Your blog is now fully integrated!

This guide will help you get your blog up and running with sample content, including the embedded Sanity Studio and smart navigation system.

## 📋 Setup Steps

### 1. Get a Sanity API Token

1. Go to [Sanity.io](https://sanity.io) and log into your account
2. Navigate to your project dashboard (project ID: `vsm3z9xo`)
3. Go to **Settings** → **API** → **Tokens**
4. Click **Add API Token**
5. Name it "Blog Seeding Token"
6. Set permissions to **Editor** (required for creating content)
7. Copy the token

### 2. Set Environment Variables

Create a `.env.local` file in your portfolio root directory:

```bash
# Add this to portfolio/.env.local
SANITY_API_TOKEN=your_token_here
```

### 3. Access Sanity Studio

You have two options to access Sanity Studio:

#### Option 1: Embedded Studio (Recommended)
Navigate to `/studio` in your running dev server:
```bash
# With your dev server running (npm run dev)
# Visit: http://localhost:3000/studio
```

#### Option 2: Standalone Studio
Open a new terminal and run:
```bash
npm run studio
```
This starts Sanity Studio at `http://localhost:3333`

Both options allow you to:
- Create and edit blog posts
- Manage categories and authors
- Upload images
- Configure content

### 4. Seed Sample Data (Optional)

To populate your blog with sample content, run:

```bash
npm run seed-blog
```

This creates:
- 5 categories (Full-Stack Development, Data Analytics, ML, Web Performance, DevOps)
- 1 author (Opsed Solutions Team)
- 3 sample blog posts with rich content

### 5. Access Your Blog

With your dev server running (`npm run dev`), you can now visit:

- **Homepage**: Scroll down to see the blog section
- **Blog listing**: `/blog` - All posts with search and filtering
- **Individual posts**: `/blog/[slug]` - Full blog post pages
- **Embedded Studio**: `/studio` - Content management interface

## 🔧 Navigation & Routing System

### Smart Navigation Implementation

The portfolio now includes a smart navigation system that adapts based on the current page:

#### Homepage Navigation (/)
- **Anchor links**: Links like "Projects", "Services", "About", "Contact" scroll to sections on the homepage
- **Smooth scrolling**: Implemented with `scroll-behavior: smooth` for better UX

#### Other Pages Navigation
- **Page links**: When not on homepage, navigation links take you to dedicated pages
- **Contact exception**: Contact always links to `/#contact` (homepage contact section)

### Conditional Components

#### Conditional Navbar (`components/conditional-navbar.tsx`)
- **Hides on studio routes**: Navbar is hidden on `/studio`, `/structure`, `/vision` routes
- **Smart path detection**: Uses `pathname.startsWith()` to catch all studio sub-routes
- **Prevents UI conflicts**: Ensures Sanity Studio has full-screen real estate

#### Conditional Footer (`components/conditional-footer.tsx`)
- **Also hides on studio routes**: Footer removed from studio pages for cleaner interface
- **Consistent behavior**: Matches navbar visibility logic

### Embedded Studio Setup

#### Studio Route Structure
```
app/
├── (root)/
│   ├── studio/
│   │   ├── layout.tsx          # Studio-specific layout
│   │   └── [[...index]]/
│   │       └── page.tsx        # Catch-all studio routes
```

#### Studio Configuration
- **Full-screen studio**: `h-screen w-full` classes for optimal editing experience
- **No navbar/footer**: Clean interface without site navigation
- **Catch-all routing**: `[[...index]]` handles all studio sub-routes (`/studio`, `/structure`, `/vision`)

#### Studio Access
- **Direct link**: Navigate to `/studio` from your navbar
- **Authenticated access**: Uses your Sanity project credentials
- **Real-time editing**: Changes reflect immediately in your blog

## 🚀 Features You Now Have

### ✅ Core Blog Functionality
- **Dynamic blog posts** from Sanity CMS
- **Search and filtering** by categories
- **Rich content editing** with code blocks, callouts, images
- **SEO optimization** with meta tags and structured data
- **Reading time estimation**
- **Responsive design** that matches your portfolio

### ✅ Engagement Features
- **Related posts** based on categories
- **Newsletter signup** (3 variants: default, compact, footer)
- **Comments system** with local storage (ready for backend integration)
- **Social sharing** capabilities
- **Author bios and profiles**

### ✅ Content Management
- **Sanity Studio** for content editing
- **Rich text editor** with:
  - Code syntax highlighting
  - Callout boxes (info, warning, error, success)
  - Image uploads with captions
  - Internal and external links
  - Lists and formatting
- **Category management** with colors
- **Author management** with social links

## 📝 Creating Your First Blog Post

1. Open Sanity Studio (`npm run studio`)
2. Click **Blog Posts** → **Create**
3. Fill in:
   - **Title**: Your post title
   - **Slug**: Auto-generated, but you can customize
   - **Excerpt**: Brief summary (shows in listings)
   - **Main Image**: Featured image for the post
   - **Author**: Select from authors (or create new)
   - **Categories**: Choose relevant categories
   - **Body**: Your rich content using the editor
   - **SEO Settings**: Optional meta title, description, keywords

4. Click **Publish** when ready

## 🔧 Customization Options

### Newsletter Integration
The newsletter signup is currently simulated. To integrate with a real service:

1. Edit `components/newsletter-signup.tsx`
2. Replace the simulated API call with your service (Mailchimp, ConvertKit, etc.)
3. Add your API credentials to environment variables

### Comments Integration
The comments are currently stored locally. To integrate with a backend:

1. Edit `components/blog-comments.tsx`
2. Replace local storage with API calls to your backend
3. Consider using services like Disqus, Commento, or building custom

### Styling Customization
All components use your existing design system:
- Colors: `#0376aa` (primary) and `#32cf37` (secondary)
- Dark mode support
- Responsive design
- Tailwind CSS classes

## 📊 Analytics & SEO

### Built-in SEO Features
- **Meta tags** for each post
- **Structured data** for better search indexing
- **Open Graph** tags for social sharing
- **Reading time** calculation
- **Optimized URLs** with meaningful slugs

### Analytics Integration
Add your analytics tracking to:
- `app/layout.tsx` for global tracking
- Individual blog post pages for detailed metrics

## 🛠️ Development Tips

### Adding New Content Types
1. Create schema in `sanity/schemas/`
2. Add to `sanity/schemas/index.ts`
3. Update TypeScript types in `lib/types.ts`
4. Create GROQ queries in `lib/queries.ts`

### Extending Portable Text
Edit `portableTextComponents` in blog post pages to:
- Add new content types
- Customize styling
- Add interactive elements

### Performance Optimization
- Images are automatically optimized via Next.js
- Consider adding image CDN for better performance
- Implement caching strategies for frequently accessed content

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Studio Navigation Issues
**Problem**: Navbar/Footer showing on studio pages
**Solution**: Ensure conditional components are properly implemented:

```typescript
// components/conditional-navbar.tsx
const PAGES_WITHOUT_NAVBAR = ['/studio', '/structure', '/vision']
```

#### Routing Conflicts
**Problem**: Studio routes not working properly
**Solution**: Verify catch-all route structure:
- File: `app/(root)/studio/[[...index]]/page.tsx`
- Bracket notation: `[[...index]]` (not `[...index]`)

#### Homepage Section Links
**Problem**: Navigation links not scrolling to sections
**Solution**: Ensure homepage sections have proper IDs:
- `#projects` - Projects section
- `#services` - Services section  
- `#about` - About section
- `#contact` - Contact section

#### Studio Access Errors
**Problem**: Cannot access Sanity Studio
**Solutions**:
1. Check Sanity project ID in `sanity.config.ts`
2. Verify API token in `.env.local`
3. Ensure you're logged into the correct Sanity account
4. Check browser console for specific error messages

### Technical Implementation Details

#### Navigation Logic
The navbar uses `usePathname()` to determine current route:

```typescript
// Smart navigation in navbar.tsx
const pathname = usePathname()
const isHomePage = pathname === '/'

// Conditional hrefs
const navLinks = [
  { href: isHomePage ? '#projects' : '/projects', label: 'Projects' },
  { href: isHomePage ? '#services' : '/services', label: 'Services' },
  { href: isHomePage ? '#about' : '/about', label: 'About' },
  { href: '/#contact', label: 'Contact' }, // Always to homepage
]
```

#### Conditional Component Structure
```typescript
// Layout implementation
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 📁 Files Created/Modified for Routing Fixes

### New Files Created
- `components/conditional-navbar.tsx` - Smart navbar that hides on studio routes
- `components/conditional-footer.tsx` - Smart footer that hides on studio routes  
- `app/(root)/studio/layout.tsx` - Studio-specific layout
- `app/(root)/studio/[[...index]]/page.tsx` - Embedded Sanity Studio

### Modified Files
- `app/layout.tsx` - Updated to use conditional navbar/footer components
- `components/navbar.tsx` - Enhanced with smart navigation logic
- `next.config.ts` - Added Sanity image domains and transpilation
- `sanity.config.ts` - Configured studio with proper structure and tools

### File Structure Overview
```
portfolio/
├── app/
│   ├── (root)/
│   │   ├── studio/
│   │   │   ├── layout.tsx          # Studio layout
│   │   │   └── [[...index]]/
│   │   │       └── page.tsx        # Studio interface
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual posts
│   │   └── layout.tsx              # Root layout
│   └── layout.tsx                  # App layout with conditional components
├── components/
│   ├── conditional-navbar.tsx      # Smart navbar component
│   ├── conditional-footer.tsx      # Smart footer component
│   ├── navbar.tsx                  # Enhanced navigation
│   └── blog/                       # Blog components
└── sanity.config.ts                # Studio configuration
```

## 🚀 Deployment

When deploying to production:

1. **Add environment variables** to your hosting platform
2. **Build the project**: `npm run build`
3. **Update Sanity CORS settings** to include your production domain
4. **Configure Sanity webhook** for automatic rebuilds when content changes

## 📞 Need Help?

- **Sanity Documentation**: https://www.sanity.io/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

Your blog is ready to showcase your expertise and engage with your audience! 🎉 