# Card Animation Usage Guide

This guide shows you how to add beautiful slide animations to any card in your application.

## 🎯 Quick Start

### 1. Basic Slide Animation

Wrap any card with `SlideCard`:

```tsx
import SlideCard from '@/components/SlideCard';

<SlideCard direction="up">
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3>My Card Title</h3>
    <p>Card content here</p>
  </div>
</SlideCard>
```

### 2. Using Pre-built Card Components

```tsx
import { SlideCardUp } from '@/components/SlideCard';
import Card from '@/components/Card';

<SlideCardUp>
  <Card 
    title="Research Project"
    description="This is my research project"
    image="/images/research.jpg"
  />
</SlideCardUp>
```

### 3. Animated Grid (Automatic Stagger)

```tsx
import SlideGrid from '@/components/SlideGrid';

<SlideGrid columns={3} direction="up" staggerDelay={0.15}>
  <Card title="Card 1" />
  <Card title="Card 2" />
  <Card title="Card 3" />
  <Card title="Card 4" />
  <Card title="Card 5" />
  <Card title="Card 6" />
</SlideGrid>
```

## 📖 Complete Examples

### Example 1: Publications Page

```tsx
import SlideGrid from '@/components/SlideGrid';
import { PublicationCard } from '@/components/Card';

export default function PublicationsPage() {
  const publications = [
    { title: "AI Research", authors: "Smith et al.", year: 2024, journal: "Nature" },
    { title: "Data Science", authors: "Jones et al.", year: 2023, journal: "Science" },
    // ... more publications
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Publications</h1>
      
      <SlideGrid columns={2} direction="up" staggerDelay={0.1}>
        {publications.map((pub, index) => (
          <PublicationCard
            key={index}
            title={pub.title}
            authors={pub.authors}
            year={pub.year}
            journal={pub.journal}
          />
        ))}
      </SlideGrid>
    </div>
  );
}
```

### Example 2: Research Projects (Alternate Direction)

```tsx
import SlideGrid from '@/components/SlideGrid';
import { ResearchCard } from '@/components/Card';

export default function ResearchPage() {
  const projects = [
    { title: "AI Project", description: "Machine learning research", status: "active", image: "/ai.jpg" },
    { title: "Data Analysis", description: "Big data processing", status: "completed", image: "/data.jpg" },
    // ... more projects
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Research Projects</h1>
      
      {/* Cards alternate sliding from left and right */}
      <SlideGrid columns={3} direction="alternate" staggerDelay={0.12}>
        {projects.map((project, index) => (
          <ResearchCard
            key={index}
            title={project.title}
            description={project.description}
            status={project.status}
            image={project.image}
          />
        ))}
      </SlideGrid>
    </div>
  );
}
```

### Example 3: Blog Posts (Individual Control)

```tsx
import SlideCard from '@/components/SlideCard';
import { BlogCard } from '@/components/Card';

export default function BlogPage() {
  const posts = [...]; // your blog posts

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="space-y-6">
        {posts.map((post, index) => (
          <SlideCard
            key={index}
            direction={index % 2 === 0 ? 'left' : 'right'}
            delay={index * 0.1}
            distance={100}
          >
            <BlogCard
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.date}
              readTime={post.readTime}
              image={post.image}
              category={post.category}
            />
          </SlideCard>
        ))}
      </div>
    </div>
  );
}
```

### Example 4: Events Calendar (Custom Animation)

```tsx
import SlideCard from '@/components/SlideCard';
import { EventCard } from '@/components/Card';

export default function EventsPage() {
  const events = [...]; // your events

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <SlideCard
            key={index}
            direction="up"
            delay={index * 0.08}
            duration={0.5}
            distance={80}
          >
            <EventCard
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              description={event.description}
              image={event.image}
            />
          </SlideCard>
        ))}
      </div>
    </div>
  );
}
```

### Example 5: Gallery (Four Directions)

```tsx
import SlideCard from '@/components/SlideCard';

export default function GalleryPage() {
  const images = [...]; // your gallery images
  const directions = ['up', 'down', 'left', 'right'];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Gallery</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <SlideCard
            key={index}
            direction={directions[index % 4]}
            delay={index * 0.05}
          >
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
          </SlideCard>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 SlideCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | The card content to animate |
| `direction` | 'up' \| 'down' \| 'left' \| 'right' | 'up' | Direction of slide animation |
| `delay` | number | 0 | Delay before animation starts (seconds) |
| `duration` | number | 0.6 | Animation duration (seconds) |
| `distance` | number | 60 | Distance to slide (pixels) |
| `className` | string | '' | Additional CSS classes |
| `hover` | boolean | true | Enable hover effect (lift & scale) |

## 🎯 SlideGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode[] | required | Array of cards to animate |
| `columns` | 1 \| 2 \| 3 \| 4 | 3 | Number of columns |
| `direction` | 'up' \| 'down' \| 'left' \| 'right' \| 'alternate' | 'up' | Animation direction |
| `staggerDelay` | number | 0.1 | Delay between each card (seconds) |
| `gap` | 4 \| 6 \| 8 | 6 | Gap between cards (Tailwind spacing) |
| `className` | string | '' | Additional CSS classes |

## 🚀 Advanced Usage

### Custom Timing

```tsx
<SlideCard
  direction="up"
  delay={0.5}
  duration={1.2}
  distance={120}
>
  <YourCard />
</SlideCard>
```

### Disable Hover Effect

```tsx
<SlideCard direction="left" hover={false}>
  <YourCard />
</SlideCard>
```

### Combine with Other Animations

```tsx
<SlideCard direction="up">
  <div className="animate-pulse bg-white p-6 rounded-lg">
    Loading content...
  </div>
</SlideCard>
```

### Responsive Grid with Animations

```tsx
<SlideGrid 
  columns={3}
  direction="alternate"
  staggerDelay={0.15}
  gap={8}
  className="px-4"
>
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</SlideGrid>
```

## 💡 Tips & Best Practices

1. **Stagger Delays**: Use `0.1-0.15s` delays for smooth sequential animations
2. **Direction Choice**: 
   - `up`: Most common, feels natural
   - `alternate`: Creates dynamic pattern
   - `left/right`: Great for horizontal layouts
3. **Performance**: Animations trigger only once when scrolled into view
4. **Accessibility**: Animations respect `prefers-reduced-motion`
5. **Mobile**: Animations work smoothly on all devices

## 🎬 Animation Patterns

### Pattern 1: Sequential (Top to Bottom)
```tsx
<SlideGrid direction="up" staggerDelay={0.1}>
  {cards}
</SlideGrid>
```

### Pattern 2: Alternating (Left-Right-Left)
```tsx
<SlideGrid direction="alternate" staggerDelay={0.12}>
  {cards}
</SlideGrid>
```

### Pattern 3: Wave Effect (Custom Delays)
```tsx
{cards.map((card, i) => (
  <SlideCard 
    key={i}
    direction="up"
    delay={Math.sin(i * 0.5) * 0.2}
  >
    {card}
  </SlideCard>
))}
```

### Pattern 4: Diagonal (Increasing Delays per Row)
```tsx
{cards.map((card, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return (
    <SlideCard 
      key={i}
      direction="up"
      delay={(row + col) * 0.1}
    >
      {card}
    </SlideCard>
  );
})}
```

## 🔧 Troubleshooting

**Cards not animating?**
- Ensure the component is client-side (`'use client'` directive)
- Check that cards are in viewport
- Verify `useInView` hook is imported correctly

**Animation too fast/slow?**
- Adjust `duration` prop (default: 0.6s)
- Modify `staggerDelay` in grids (default: 0.1s)

**Cards jumping on load?**
- This is normal - cards start hidden and slide in
- Adjust `distance` prop if too dramatic

## 📦 Files Created

- `components/SlideCard.tsx` - Main slide animation component
- `components/SlideGrid.tsx` - Automated grid with stagger
- `components/Card.tsx` - Pre-built card components
- `components/AnimatedCard.tsx` - Advanced animations (flip, blur, etc.)
- `components/AnimatedGrid.tsx` - Grid with multiple animation types
- `lib/hooks/useInView.ts` - Intersection observer hook
- `lib/animations.ts` - Animation configurations
- `app/globals.css` - CSS keyframe animations

Now every card in your application can have beautiful slide animations! 🎉
