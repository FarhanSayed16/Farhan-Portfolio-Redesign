import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Testimonial } from '@/lib/content';
import { Quote, Target } from 'lucide-react'; // Assuming lucide-react is available based on previous cyberpunk UI elements

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const AUTOPLAY_DURATION = 8000; // 8 seconds per slide
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [index, isPaused, testimonials.length]);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div 
      className="bv-testimonial-slider premium-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="premium-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="bv-testimonial-card premium-card"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="premium-card-bg">
              <Quote className="watermark-quote" />
            </div>
            
            <div className="premium-card-content">
              <div className="testimonial-header">
                <div className="avatar-container">
                  {testimonials[index].image ? (
                    <img 
                      src={testimonials[index].image} 
                      alt={testimonials[index].name} 
                      className="testimonial-avatar-img"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLDivElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="testimonial-avatar-fallback" 
                    style={{ display: testimonials[index].image ? 'none' : 'flex' }}
                  >
                    {testimonials[index].avatar}
                  </div>
                </div>
                <div className="testimonial-meta">
                  <h4 className="testimonial-name">{testimonials[index].name}</h4>
                  <p className="testimonial-role">
                    <span className="role-highlight">{testimonials[index].role}</span> 
                    <span className="role-separator">at</span> 
                    {testimonials[index].organization}
                  </p>
                </div>
              </div>
              
              <div className="testimonial-body">
                <p className="bv-testimonial-quote premium-quote">"{testimonials[index].content}"</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bv-slider-controls premium-controls">
        <button type="button" onClick={prev} className="bv-slider-btn cyber-btn">
          ←
        </button>
        <div className="slider-progress-container">
          <div className="slider-progress-track">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`progress-segment ${i === index ? 'active' : ''} ${i < index ? 'completed' : ''}`}
                onClick={() => setIndex(i)}
              >
                <div 
                  className="progress-fill"
                  style={{
                    animationDuration: i === index && !isPaused ? `${AUTOPLAY_DURATION}ms` : '0ms',
                    animationPlayState: isPaused ? 'paused' : 'running'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={next} className="bv-slider-btn cyber-btn">
          →
        </button>
      </div>
    </div>
  );
}
