import SlideCard, { SlideCardLeft, SlideCardRight } from '@/components/SlideCard';
import SlideGrid from '@/components/SlideGrid';

export const metadata = {
  title: 'Animation Test - Slide Cards',
  description: 'Testing slide card animations',
};

export default function TestAnimationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-navy-900 mb-8">Slide Card Animations Test</h1>
      
      <p className="text-gray-600 mb-8">Scroll down to see cards slide in from different directions</p>

      {/* Section 1: Cards sliding from left */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-navy-800 mb-6">Cards Sliding from Left</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SlideCardLeft delay={0}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy-900 mb-2">Card 1</h3>
              <p className="text-gray-600">This card slides in from the left with no delay</p>
            </div>
          </SlideCardLeft>
          
          <SlideCardLeft delay={0.2}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy-900 mb-2">Card 2</h3>
              <p className="text-gray-600">This card slides in from the left with 0.2s delay</p>
            </div>
          </SlideCardLeft>
          
          <SlideCardLeft delay={0.4}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy-900 mb-2">Card 3</h3>
              <p className="text-gray-600">This card slides in from the left with 0.4s delay</p>
            </div>
          </SlideCardLeft>
        </div>
      </section>

      {/* Section 2: Cards sliding from right */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-navy-800 mb-6">Cards Sliding from Right</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SlideCardRight delay={0}>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Card 1</h3>
              <p className="text-blue-700">This card slides in from the right</p>
            </div>
          </SlideCardRight>
          
          <SlideCardRight delay={0.2}>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Card 2</h3>
              <p className="text-blue-700">This card slides in from the right with delay</p>
            </div>
          </SlideCardRight>
          
          <SlideCardRight delay={0.4}>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Card 3</h3>
              <p className="text-blue-700">This card slides in from the right with more delay</p>
            </div>
          </SlideCardRight>
        </div>
      </section>

      {/* Section 3: Alternating slide grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-navy-800 mb-6">Alternating Slide Grid</h2>
        <p className="text-gray-600 mb-4">Cards alternate between sliding from left and right</p>
        
        <SlideGrid columns={3} staggerDelay={0.15}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Card {num}</h3>
              <p className="text-purple-700">This card alternates slide direction based on position</p>
            </div>
          ))}
        </SlideGrid>
      </section>

      {/* Section 4: Different directions */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-navy-800 mb-6">All Four Directions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SlideCard direction="up" delay={0}>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-green-900 mb-2">⬆️ From Bottom</h3>
              <p className="text-green-700">Slides up from bottom</p>
            </div>
          </SlideCard>
          
          <SlideCard direction="down" delay={0.2}>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-orange-900 mb-2">⬇️ From Top</h3>
              <p className="text-orange-700">Slides down from top</p>
            </div>
          </SlideCard>
          
          <SlideCard direction="left" delay={0.4}>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-teal-900 mb-2">⬅️ From Right</h3>
              <p className="text-teal-700">Slides in from right to left</p>
            </div>
          </SlideCard>
          
          <SlideCard direction="right" delay={0.6}>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">➡️ From Left</h3>
              <p className="text-indigo-700">Slides in from left to right</p>
            </div>
          </SlideCard>
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-yellow-900 mb-3">✅ Animation Test Complete</h2>
        <p className="text-yellow-800 mb-2">If you scrolled down and saw cards sliding in from different directions, the animations are working correctly!</p>
        <p className="text-yellow-700 text-sm">The cards also have hover effects - try hovering over them to see the scale and shadow animation.</p>
      </section>
    </div>
  );
}
