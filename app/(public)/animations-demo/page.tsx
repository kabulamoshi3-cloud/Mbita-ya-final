import SlideCard, { SlideCardUp, SlideCardDown, SlideCardLeft, SlideCardRight } from '@/components/SlideCard';
import SlideGrid from '@/components/SlideGrid';
import Card, { PublicationCard, ResearchCard, EventCard, BlogCard } from '@/components/Card';

export const metadata = {
  title: 'Animation Demo - Card Slide Effects',
  description: 'Showcase of beautiful card slide animations'
};

export default function AnimationDemoPage() {
  const sampleCards = [
    { id: 1, title: 'Card 1', description: 'This card slides in beautifully' },
    { id: 2, title: 'Card 2', description: 'With smooth animations' },
    { id: 3, title: 'Card 3', description: 'And perfect timing' },
    { id: 4, title: 'Card 4', description: 'Watch them appear' },
    { id: 5, title: 'Card 5', description: 'One after another' },
    { id: 6, title: 'Card 6', description: 'Creating a wave effect' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <SlideCardDown delay={0}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Card Animation Demo
            </h1>
            <p className="text-xl text-gray-600">
              Beautiful slide animations for every card
            </p>
          </div>
        </SlideCardDown>

        {/* Section 1: Basic Directions */}
        <section className="mb-20">
          <SlideCardUp delay={0.1}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              1. Basic Slide Directions
            </h2>
          </SlideCardUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SlideCardUp delay={0.2}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">⬆️</div>
                  <h3 className="text-xl font-bold mb-2">Slide Up</h3>
                  <p className="text-blue-100">From bottom to top</p>
                </div>
              </div>
            </SlideCardUp>

            <SlideCardDown delay={0.3}>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">⬇️</div>
                  <h3 className="text-xl font-bold mb-2">Slide Down</h3>
                  <p className="text-purple-100">From top to bottom</p>
                </div>
              </div>
            </SlideCardDown>

            <SlideCardLeft delay={0.4}>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">⬅️</div>
                  <h3 className="text-xl font-bold mb-2">Slide Left</h3>
                  <p className="text-green-100">From right to left</p>
                </div>
              </div>
            </SlideCardLeft>

            <SlideCardRight delay={0.5}>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">➡️</div>
                  <h3 className="text-xl font-bold mb-2">Slide Right</h3>
                  <p className="text-orange-100">From left to right</p>
                </div>
              </div>
            </SlideCardRight>
          </div>
        </section>

        {/* Section 2: Staggered Grid */}
        <section className="mb-20">
          <SlideCardUp delay={0}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              2. Staggered Grid Animation
            </h2>
          </SlideCardUp>
          
          <SlideGrid columns={3} direction="up" staggerDelay={0.1}>
            {sampleCards.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                description={card.description}
                variant="bordered"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
            ))}
          </SlideGrid>
        </section>

        {/* Section 3: Alternate Direction */}
        <section className="mb-20">
          <SlideCardUp delay={0}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              3. Alternating Direction
            </h2>
          </SlideCardUp>
          
          <SlideGrid columns={2} direction="alternate" staggerDelay={0.15}>
            <PublicationCard
              title="Machine Learning Applications in Healthcare"
              authors="Smith, J., Johnson, A."
              year={2024}
              journal="Nature Medicine"
            />
            <PublicationCard
              title="Deep Learning for Climate Prediction"
              authors="Brown, M., Davis, K."
              year={2024}
              journal="Science"
            />
            <PublicationCard
              title="Quantum Computing Advances"
              authors="Wilson, R., Taylor, S."
              year={2023}
              journal="Physical Review Letters"
            />
            <PublicationCard
              title="Neural Networks in Robotics"
              authors="Anderson, L., Thomas, P."
              year={2023}
              journal="IEEE Transactions"
            />
          </SlideGrid>
        </section>

        {/* Section 4: Research Cards */}
        <section className="mb-20">
          <SlideCardUp delay={0}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              4. Research Project Cards
            </h2>
          </SlideCardUp>
          
          <SlideGrid columns={3} direction="up" staggerDelay={0.12}>
            <ResearchCard
              title="AI in Education"
              description="Developing intelligent tutoring systems using advanced machine learning techniques"
              status="active"
              image="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop"
            />
            <ResearchCard
              title="Renewable Energy Optimization"
              description="Optimizing solar panel placement using computer vision and geographic analysis"
              status="completed"
              image="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop"
            />
            <ResearchCard
              title="Smart City Infrastructure"
              description="IoT-based solutions for urban planning and traffic management"
              status="upcoming"
              image="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=400&fit=crop"
            />
          </SlideGrid>
        </section>

        {/* Section 5: Event Cards */}
        <section className="mb-20">
          <SlideCardUp delay={0}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              5. Event Cards with Icons
            </h2>
          </SlideCardUp>
          
          <SlideGrid columns={2} direction="left" staggerDelay={0.1}>
            <EventCard
              title="Annual Research Symposium 2024"
              date="March 15, 2024"
              time="9:00 AM - 5:00 PM"
              location="University Main Hall"
              description="Join us for presentations of cutting-edge research from faculty and students"
              image="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop"
            />
            <EventCard
              title="AI Workshop Series"
              date="March 22, 2024"
              time="2:00 PM - 4:00 PM"
              location="Tech Lab Building B"
              description="Hands-on workshop covering the latest developments in artificial intelligence"
              image="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop"
            />
          </SlideGrid>
        </section>

        {/* Section 6: Blog Cards */}
        <section className="mb-20">
          <SlideCardUp delay={0}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              6. Blog Post Cards
            </h2>
          </SlideCardUp>
          
          <SlideGrid columns={3} direction="up" staggerDelay={0.1}>
            <BlogCard
              title="Getting Started with Machine Learning"
              excerpt="A comprehensive guide to understanding the fundamentals of ML and how to begin your journey"
              author="Dr. Emmanuel Mbita"
              date="Feb 28, 2024"
              readTime="5 min"
              category="Tutorial"
              image="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop"
            />
            <BlogCard
              title="The Future of Quantum Computing"
              excerpt="Exploring the potential impact of quantum computers on various industries and research fields"
              author="Dr. Emmanuel Mbita"
              date="Feb 25, 2024"
              readTime="8 min"
              category="Research"
              image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop"
            />
            <BlogCard
              title="Data Science Best Practices"
              excerpt="Essential tips and techniques for conducting effective data analysis and visualization"
              author="Dr. Emmanuel Mbita"
              date="Feb 20, 2024"
              readTime="6 min"
              category="Guide"
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
            />
          </SlideGrid>
        </section>

        {/* Section 7: Custom Timing */}
        <section className="mb-20">
          <SlideCardUp delay={0}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              7. Custom Animation Timing
            </h2>
          </SlideCardUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SlideCard direction="up" delay={0} duration={0.4} distance={40}>
              <div className="bg-white border-2 border-blue-200 p-6 rounded-xl text-center">
                <h3 className="font-bold text-lg mb-2">Fast (0.4s)</h3>
                <p className="text-gray-600 text-sm">Quick and snappy</p>
              </div>
            </SlideCard>
            
            <SlideCard direction="up" delay={0.2} duration={0.8} distance={80}>
              <div className="bg-white border-2 border-purple-200 p-6 rounded-xl text-center">
                <h3 className="font-bold text-lg mb-2">Medium (0.8s)</h3>
                <p className="text-gray-600 text-sm">Smooth and balanced</p>
              </div>
            </SlideCard>
            
            <SlideCard direction="up" delay={0.4} duration={1.2} distance={120}>
              <div className="bg-white border-2 border-green-200 p-6 rounded-xl text-center">
                <h3 className="font-bold text-lg mb-2">Slow (1.2s)</h3>
                <p className="text-gray-600 text-sm">Dramatic and elegant</p>
              </div>
            </SlideCard>
          </div>
        </section>

        {/* Footer */}
        <SlideCardUp delay={0}>
          <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Use These Animations?
            </h3>
            <p className="text-xl mb-6">
              Check out the ANIMATION_USAGE.md file for complete documentation
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/20 px-6 py-3 rounded-lg backdrop-blur-sm">
                <code className="text-sm">import SlideCard from '@/components/SlideCard'</code>
              </div>
            </div>
          </div>
        </SlideCardUp>

      </div>
    </div>
  );
}
