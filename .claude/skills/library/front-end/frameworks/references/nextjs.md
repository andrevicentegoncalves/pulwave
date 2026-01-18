# Next.js Patterns

## App Router Essentials

### Server Components (Default)
```tsx
// Runs on server, no JavaScript sent to client
async function UsersPage() {
  const users = await fetchUsers(); // Direct server-side fetch
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Client Components (Interactive)
```tsx
'use client';

function InteractiveCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  );
}
```

## Data Fetching

### Parallel Fetching
```tsx
async function Dashboard() {
  // Runs in parallel ✅
  const [user, stats, activity] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchActivity()
  ]);
  
  return <DashboardUI user={user} stats={stats} activity={activity} />;
}
```

### Streaming with Suspense
```tsx
async function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<ChartsSkeleton />}>
        <Charts />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <DataTable />
      </Suspense>
    </>
  );
}
```

### Data Caching
```tsx
// Cached for 1 hour
export const revalidate = 3600;

// Or per-fetch
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }
});
```

## Rendering Strategies

### Static Site Generation (SSG)
```tsx
// Pre-rendered at build time
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <Article post={post} />;
}

// Generate all known paths at build
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

### Incremental Static Regeneration (ISR)
```tsx
// Revalidate every 24 hours
export const revalidate = 86400;

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetails product={product} />;
}
```

### Server-Side Rendering (SSR)
```tsx
// Always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const liveData = await fetchLiveData();
  return <Dashboard data={liveData} />;
}
```

## Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority  // LCP image
/>
```

### Font Optimization
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Dynamic Imports
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('./HeavyChart'),
  { 
    ssr: false,
    loading: () => <ChartSkeleton />
  }
);
```

## Metadata & SEO

```tsx
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.jpg'],
  },
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
  };
}
```
