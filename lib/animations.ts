/**
 * Animation utilities for cards and components
 * Provides attractive slide, fade, and scale animations
 */

export const cardAnimations = {
  // Fade in from bottom with slide
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  // Fade in from top with slide
  fadeInDown: {
    initial: { opacity: 0, y: -60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  // Fade in from left with slide
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  // Fade in from right with slide
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  // Scale up with fade
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },

  // Pop effect
  popIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.5, 
      ease: [0.34, 1.56, 0.64, 1] // Bounce effect
    }
  },

  // Flip in
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  // Blur in
  blurIn: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

// Stagger animation for lists of cards
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Hover animations
export const cardHoverEffects = {
  // Lift and shadow
  lift: {
    rest: { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    hover: { 
      y: -8, 
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },

  // Scale up slightly
  scale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },

  // Glow effect
  glow: {
    rest: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    hover: { 
      boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
      transition: { duration: 0.3 }
    }
  },

  // Tilt effect
  tilt: {
    rest: { rotateX: 0, rotateY: 0 },
    hover: { 
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.3 }
    }
  },

  // Border glow
  borderGlow: {
    rest: { borderColor: 'rgba(0,0,0,0.1)' },
    hover: { 
      borderColor: 'rgba(59, 130, 246, 0.8)',
      transition: { duration: 0.3 }
    }
  }
};

// Scroll reveal configuration
export const scrollRevealConfig = {
  threshold: 0.15,
  triggerOnce: true
};

// Generate stagger delay for nth child
export const getStaggerDelay = (index: number, baseDelay: number = 0.1) => {
  return index * baseDelay;
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Loading animations
export const loadingAnimation = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },
  
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }
};
