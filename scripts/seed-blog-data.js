const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "vsm3z9xo",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
});

const sampleCategories = [
  {
    _type: "category",
    title: "Full-Stack Development",
    slug: { current: "full-stack-development" },
    description: "Articles about building end-to-end web applications",
    color: { hex: "#0376aa" },
  },
  {
    _type: "category",
    title: "Data Analytics",
    slug: { current: "data-analytics" },
    description: "Insights into data analysis and business intelligence",
    color: { hex: "#32cf37" },
  },
  {
    _type: "category",
    title: "Machine Learning",
    slug: { current: "machine-learning" },
    description: "AI and ML techniques for modern applications",
    color: { hex: "#ff6b35" },
  },
  {
    _type: "category",
    title: "Web Performance",
    slug: { current: "web-performance" },
    description: "Optimizing web applications for speed and efficiency",
    color: { hex: "#8b5cf6" },
  },
  {
    _type: "category",
    title: "DevOps",
    slug: { current: "devops" },
    description: "Deployment, CI/CD, and infrastructure topics",
    color: { hex: "#f59e0b" },
  },
];

const sampleAuthor = {
  _type: "author",
  name: "Opsed Solutions Team",
  slug: { current: "opsed-team" },
  bio: "Expert team of full-stack developers and data analysts at Opsed Solutions, passionate about creating efficient web platforms and deriving actionable insights from data.",
  social: {
    linkedin: "https://linkedin.com/company/opsed-solutions",
    github: "https://github.com/opsed-solutions",
    website: "https://opsed-solutions.com",
  },
};

const samplePosts = [
  {
    _type: "post",
    title: "Building Scalable React Applications with Next.js 15",
    slug: { current: "building-scalable-react-applications-nextjs-15" },
    excerpt:
      "Learn how to leverage Next.js 15 features to build performant, scalable React applications that can handle enterprise-level traffic and complexity.",
    publishedAt: new Date("2024-01-15").toISOString(),
    featured: true,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Next.js 15 brings significant improvements to React development, offering enhanced performance, better developer experience, and new features that make building scalable applications easier than ever.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Key Features in Next.js 15" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The latest version introduces several game-changing features:",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [
          {
            _type: "span",
            text: "Improved App Router with better caching strategies",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [
          { _type: "span", text: "Enhanced Server Components performance" },
        ],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [
          {
            _type: "span",
            text: "Better TypeScript integration and type safety",
          },
        ],
      },
      {
        _type: "codeBlock",
        code: `// Example of improved App Router usage
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Scalable App',
  description: 'Built with Next.js 15',
}

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to my scalable app!</h1>
    </div>
  )
}`,
        language: "typescript",
        filename: "app/page.tsx",
      },
      {
        _type: "callout",
        type: "info",
        title: "Pro Tip",
        content:
          "Always use TypeScript with Next.js for better development experience and fewer runtime errors.",
      },
    ],
    seo: {
      metaTitle:
        "Building Scalable React Apps with Next.js 15 - Complete Guide",
      metaDescription:
        "Comprehensive guide to building scalable React applications using Next.js 15 features and best practices.",
      keywords: [
        "Next.js",
        "React",
        "Scalability",
        "Web Development",
        "TypeScript",
      ],
    },
  },
  {
    _type: "post",
    title: "Data Visualization Best Practices with Python and Tableau",
    slug: { current: "data-visualization-best-practices-python-tableau" },
    excerpt:
      "Discover how to create compelling data visualizations that tell stories and drive business decisions using Python libraries and Tableau.",
    publishedAt: new Date("2024-01-10").toISOString(),
    featured: false,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Effective data visualization is crucial for transforming raw data into actionable insights. This guide covers best practices for creating impactful visualizations.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Choosing the Right Chart Type" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The foundation of good data visualization is selecting the appropriate chart type for your data and message.",
          },
        ],
      },
      {
        _type: "codeBlock",
        code: `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Create a sample dataset
data = pd.DataFrame({
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    'revenue': [15000, 18000, 22000, 19000, 25000],
    'expenses': [12000, 14000, 16000, 15000, 18000]
})

# Create a clean, informative chart
plt.figure(figsize=(10, 6))
plt.plot(data['month'], data['revenue'], marker='o', label='Revenue', linewidth=2)
plt.plot(data['month'], data['expenses'], marker='s', label='Expenses', linewidth=2)
plt.title('Monthly Revenue vs Expenses', fontsize=16, fontweight='bold')
plt.xlabel('Month', fontsize=12)
plt.ylabel('Amount ($)', fontsize=12)
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        language: "python",
        filename: "visualization_example.py",
      },
      {
        _type: "callout",
        type: "success",
        title: "Key Insight",
        content:
          "Always prioritize clarity over complexity. A simple, well-designed chart often communicates more effectively than a complex visualization.",
      },
    ],
    seo: {
      keywords: [
        "Data Visualization",
        "Python",
        "Tableau",
        "Business Intelligence",
        "Analytics",
      ],
    },
  },
  {
    _type: "post",
    title: "Implementing Machine Learning Models in Production",
    slug: { current: "implementing-ml-models-production" },
    excerpt:
      "A comprehensive guide to deploying machine learning models in production environments, covering MLOps best practices and deployment strategies.",
    publishedAt: new Date("2024-01-05").toISOString(),
    featured: false,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Moving machine learning models from development to production requires careful planning, robust infrastructure, and monitoring systems.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Model Deployment Strategies" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "There are several approaches to deploying ML models, each with its own trade-offs:",
          },
        ],
      },
      {
        _type: "callout",
        type: "warning",
        title: "Important Consideration",
        content:
          "Always implement proper model versioning and rollback mechanisms before deploying to production.",
      },
    ],
    seo: {
      keywords: [
        "Machine Learning",
        "MLOps",
        "Production Deployment",
        "AI",
        "Model Management",
      ],
    },
  },
];

async function seedData() {
  try {
    console.log("Starting to seed blog data...");

    // Create categories first
    console.log("Creating categories...");
    const categoryPromises = sampleCategories.map((category) =>
      client.create(category)
    );
    const createdCategories = await Promise.all(categoryPromises);
    console.log(`Created ${createdCategories.length} categories`);

    // Create author
    console.log("Creating author...");
    const createdAuthor = await client.create(sampleAuthor);
    console.log("Created author:", createdAuthor.name);

    // Create posts with references
    console.log("Creating blog posts...");
    const postsWithRefs = samplePosts.map((post, index) => ({
      ...post,
      author: { _ref: createdAuthor._id, _type: "reference" },
      categories: [
        {
          _ref: createdCategories[index % createdCategories.length]._id,
          _type: "reference",
        },
      ],
    }));

    const postPromises = postsWithRefs.map((post) => client.create(post));
    const createdPosts = await Promise.all(postPromises);
    console.log(`Created ${createdPosts.length} blog posts`);

    console.log("✅ Blog data seeded successfully!");
    console.log("\nYou can now:");
    console.log("1. Visit your blog at /blog to see the posts");
    console.log('2. Run "npm run studio" to manage content in Sanity Studio');
    console.log("3. Edit posts, add images, and create more content!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData };
