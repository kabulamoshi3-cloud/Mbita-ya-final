/**
 * Professional Animation Components Library
 * 
 * Industry-standard scroll animations following best practices from:
 * - Apple
 * - MIT & Stanford
 * - Google Material Design
 * - Modern web standards
 * 
 * Features:
 * ✅ Performance optimized (RAF, GPU acceleration)
 * ✅ Accessibility compliant (prefers-reduced-motion)
 * ✅ Mobile-friendly
 * ✅ TypeScript typed
 * ✅ Customizable
 * ✅ Production-ready
 */

// Core animation components
export { default as ParallaxHero } from './ParallaxHero';
export { default as ScrollProgress } from './ScrollProgress';
export { default as CountUp, CountUpPercent, CountUpPlus, CountUpCurrency } from './CountUp';
export { default as SmoothScroll, ScrollToTop } from './SmoothScroll';
export { default as FadeInView, FadeInBlur, FadeInScale, FadeInBlurScale } from './FadeInView';

// Existing components
export { default as SlideCard } from '../SlideCard';
export { default as SlideGrid } from '../SlideGrid';

/**
 * Quick Usage Guide:
 * 
 * 1. Parallax Hero (Homepage header):
 *    <ParallaxHero backgroundImage="/hero.jpg">
 *      <h1>Welcome</h1>
 *    </ParallaxHero>
 * 
 * 2. Scroll Progress (Long pages):
 *    <ScrollProgress color="#3b82f6" />
 * 
 * 3. Count-Up Stats:
 *    <CountUp end={1234} suffix="+" />
 *    <CountUpPercent end={95} />
 * 
 * 4. Smooth Scroll (Add to layout):
 *    <SmoothScroll />
 *    <ScrollToTop />
 * 
 * 5. Fade In (Images, cards):
 *    <FadeInView blur scale>
 *      <img src="..." />
 *    </FadeInView>
 * 
 * 6. Slide Cards (Content sections):
 *    <SlideCard direction="up" delay={0.2}>
 *      <Card />
 *    </SlideCard>
 */
