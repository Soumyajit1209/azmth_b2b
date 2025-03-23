
import { cn } from '@/lib/utils';

/**
 * Provides animation classes for various UI elements
 */
export const animations = {
  /**
   * Applies a staggered fade-in animation to children elements
   * @param index The index of the element in the sequence
   * @returns Tailwind classes for the animation
   */
  fadeInStagger: (index: number = 0) => {
    const delay = index * 100; // 100ms stagger
    return cn(
      'animate-fade-in',
      delay && `[animation-delay:${delay}ms]`
    );
  },

  /**
   * Applies a float animation for subtle movement
   * @returns Tailwind classes for the animation
   */
  float: () => 'animate-float',

  /**
   * Applies a subtle pulse animation
   * @returns Tailwind classes for the animation
   */
  pulse: () => 'animate-pulse-subtle',

  /**
   * Applies a slow spin animation
   * @returns Tailwind classes for the animation
   */
  spinSlow: () => 'animate-spin-slow',

  /**
   * Applies a progress animation
   * @returns Tailwind classes for the animation
   */
  progress: () => 'animate-progress',

  /**
   * Combines multiple animations
   * @param animations An array of animation classes
   * @returns Combined tailwind classes for the animations
   */
  combine: (...animations: string[]) => cn(...animations)
};
