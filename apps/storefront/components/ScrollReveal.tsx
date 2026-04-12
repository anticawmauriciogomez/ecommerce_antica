"use client";

import { ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  threshold
}: ScrollRevealProps) {
  const { ref, isIntersecting } = useIntersectionObserver(
    threshold ? { threshold } : {}
  );

  return (
    <div
      ref={ref}
      className={`${styles.scrollReveal} ${styles[direction]} ${
        isIntersecting ? styles.visible : ''
      } ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        transitionDelay: isIntersecting ? `${delay}ms` : '0ms'
      }}
    >
      {children}
    </div>
  );
}