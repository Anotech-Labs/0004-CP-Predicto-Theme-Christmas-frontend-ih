import React, { useEffect, useRef } from 'react';

const ChristmasEffects = ({ numberOfSnowflakes = 55 }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion)");
    if (reduceMotionQuery.matches) return;

    const container = containerRef.current;
    if (!container) return;

    const parentElement = container.parentElement;
    let containerWidth = parentElement ? parentElement.clientWidth : 400;
    let containerHeight = parentElement ? parentElement.clientHeight : window.innerHeight;

    // Easing functions for smooth motion
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
    
    // Snowflake and star characters
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉', '•'];
    const starChars = ['⭐', '✨', '★', '✦', '✧'];
    
    // Ultra-smooth Snowflake class - SLOW & GENTLE
    class Snowflake {
      constructor(element, speed, xPos, yPos, size) {
        this.element = element;
        this.speed = speed;
        this.size = size;
        
        // Position
        this.xPos = xPos;
        this.yPos = yPos;
        
        // Animation parameters - MUCH SLOWER
        this.time = Math.random() * 1000;
        this.phase = Math.random() * Math.PI * 2;
        this.wobbleFreq = 0.3 + Math.random() * 0.3; // Slower wobble
        this.wobbleAmp = 8 + Math.random() * 12; // Gentler wobble
        this.fallSpeed = 0.08 + Math.random() * 0.12; // Much slower fall
        
        // Rotation - very slow
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        
        // Opacity
        this.baseOpacity = 0.5 + Math.random() * 0.4;
        this.currentOpacity = this.baseOpacity;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.5 + Math.random() * 0.5; // Slower twinkle
        
        // Scale breathing - subtle
        this.baseScale = 0.9 + Math.random() * 0.2;
        this.currentScale = this.baseScale;
        this.scalePhase = Math.random() * Math.PI * 2;
      }

      update(maxWidth, maxHeight, dt) {
        this.time += dt * 0.0003; // Much slower time progression
        
        // Very gentle sinusoidal wobble
        const wobble = Math.sin(this.time * this.wobbleFreq + this.phase) * this.wobbleAmp;
        this.xPos += wobble * 0.003 * dt * 0.06;
        
        // Very slow gentle fall
        this.yPos += this.speed * this.fallSpeed * dt * 0.015;
        
        // Very slow rotation
        this.rotation += this.rotationSpeed * dt * 0.02;
        
        // Subtle scale breathing
        this.scalePhase += dt * 0.0005;
        const scaleWave = Math.sin(this.scalePhase) * 0.08;
        const targetScale = this.baseScale + scaleWave;
        this.currentScale += (targetScale - this.currentScale) * 0.05;
        
        // Gentle twinkle opacity
        this.twinklePhase += dt * 0.0008 * this.twinkleSpeed;
        const twinkle = 0.85 + Math.sin(this.twinklePhase) * 0.15;
        const targetOpacity = this.baseOpacity * twinkle;
        this.currentOpacity += (targetOpacity - this.currentOpacity) * 0.08;

        // Wrap around edges
        if (this.xPos < -30) this.xPos = maxWidth + 20;
        if (this.xPos > maxWidth + 30) this.xPos = -20;

        // Apply transforms
        this.element.style.opacity = this.currentOpacity;
        this.element.style.transform = `translate3d(${this.xPos}px, ${this.yPos}px, 0) rotate(${this.rotation}deg) scale(${this.currentScale})`;

        // Reset at bottom
        if (this.yPos > maxHeight + 30) {
          this.yPos = -30 - Math.random() * 50;
          this.xPos = Math.random() * maxWidth;
          this.phase = Math.random() * Math.PI * 2;
        }
      }
    }

    // Ultra-smooth Star class - SLOW & GENTLE twinkle
    class FallingStar {
      constructor(element, speed, xPos, yPos, size) {
        this.element = element;
        this.speed = speed;
        this.size = size;
        
        this.xPos = xPos;
        this.yPos = yPos;
        
        // Animation - MUCH SLOWER
        this.time = Math.random() * 1000;
        this.phase = Math.random() * Math.PI * 2;
        this.wobbleFreq = 0.15 + Math.random() * 0.15;
        this.wobbleAmp = 5 + Math.random() * 8;
        this.fallSpeed = 0.05 + Math.random() * 0.08; // Very slow fall
        
        // Beautiful slow twinkle
        this.baseOpacity = 0.6 + Math.random() * 0.4;
        this.currentOpacity = this.baseOpacity;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.8 + Math.random() * 1;
        this.twinkleIntensity = 0.3 + Math.random() * 0.2;
        
        // Subtle pulse
        this.baseScale = 1;
        this.currentScale = 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(maxWidth, maxHeight, dt) {
        this.time += dt * 0.0003;
        
        // Very gentle drift
        const drift = Math.sin(this.time * this.wobbleFreq + this.phase) * this.wobbleAmp * 0.005;
        this.xPos += drift * dt * 0.06;
        
        // Very slow graceful fall
        this.yPos += this.speed * this.fallSpeed * dt * 0.012;
        
        // Slow beautiful twinkle
        this.twinklePhase += dt * 0.001 * this.twinkleSpeed;
        const twinkleWave = Math.sin(this.twinklePhase);
        const twinkle = 1 - this.twinkleIntensity + twinkleWave * this.twinkleIntensity;
        const targetOpacity = this.baseOpacity * Math.max(0.4, twinkle);
        this.currentOpacity += (targetOpacity - this.currentOpacity) * 0.1;
        
        // Very subtle pulse
        this.pulsePhase += dt * 0.0008;
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.05;
        this.currentScale += (pulse - this.currentScale) * 0.08;

        this.element.style.opacity = this.currentOpacity;
        this.element.style.transform = `translate3d(${this.xPos}px, ${this.yPos}px, 0) scale(${this.currentScale})`;

        if (this.yPos > maxHeight + 30) {
          this.yPos = -30 - Math.random() * 40;
          this.xPos = Math.random() * maxWidth;
        }
      }
    }

    // Create particles with optimized GPU styles
    const createParticles = () => {
      container.innerHTML = '';
      particlesRef.current = [];

      // Create snowflakes with varied sizes
      for (let i = 0; i < numberOfSnowflakes; i++) {
        const el = document.createElement('div');
        const sizeType = Math.random();
        let size;
        if (sizeType < 0.5) size = 4 + Math.random() * 4;
        else if (sizeType < 0.85) size = 10 + Math.random() * 6;
        else size = 16 + Math.random() * 8;

        const isChar = size > 6 && Math.random() > 0.3;
        
        if (isChar) {
          el.innerHTML = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
          el.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            color: #ffffff;
            text-shadow: 0 0 4px rgba(255,255,255,0.9), 0 0 8px rgba(173,216,230,0.6);
            user-select: none;
            z-index: 9998;
            pointer-events: none;
            font-size: ${size}px;
            line-height: 1;
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: translateZ(0);
          `;
        } else {
          el.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            background: radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.8) 40%, rgba(200,220,255,0.3) 100%);
            box-shadow: 0 0 ${size/2}px rgba(255,255,255,0.9), 0 0 ${size}px rgba(173,216,230,0.5);
            user-select: none;
            z-index: 9998;
            pointer-events: none;
            border-radius: 50%;
            width: ${size}px;
            height: ${size}px;
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: translateZ(0);
          `;
        }
        
        container.appendChild(el);
        const xPos = Math.random() * containerWidth;
        const yPos = Math.random() * containerHeight * 1.2 - containerHeight * 0.2;
        particlesRef.current.push(new Snowflake(el, 8 + Math.random() * 20, xPos, yPos, size));
      }

      // Create falling stars
      for (let i = 0; i < 10; i++) {
        const el = document.createElement('div');
        const star = starChars[Math.floor(Math.random() * starChars.length)];
        const size = 12 + Math.random() * 10;
        
        el.innerHTML = star;
        el.style.cssText = `
          position: absolute;
          left: 0;
          top: 0;
          color: #ffd700;
          text-shadow: 0 0 6px rgba(255,215,0,0.9), 0 0 12px rgba(255,200,50,0.6), 0 0 20px rgba(255,180,0,0.3);
          user-select: none;
          z-index: 9997;
          pointer-events: none;
          font-size: ${size}px;
          line-height: 1;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
        `;
        
        container.appendChild(el);
        const xPos = Math.random() * containerWidth;
        const yPos = Math.random() * containerHeight;
        particlesRef.current.push(new FallingStar(el, 5 + Math.random() * 12, xPos, yPos, size));
      }
    };

    // Ultra-smooth animation loop with precise timing
    let lastTime = 0;
    let accumulator = 0;
    const fixedDt = 16.667; // Target 60fps
    
    const animate = (currentTime) => {
      if (lastTime === 0) lastTime = currentTime;
      
      const frameTime = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;
      accumulator += frameTime;
      
      // Fixed timestep with interpolation for butter-smooth motion
      while (accumulator >= fixedDt) {
        const parent = container.parentElement;
        if (parent) {
          containerWidth = parent.clientWidth;
          containerHeight = parent.clientHeight;
        }

        const particles = particlesRef.current;
        const len = particles.length;
        for (let i = 0; i < len; i++) {
          particles[i].update(containerWidth, containerHeight, fixedDt);
        }
        
        accumulator -= fixedDt;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      containerWidth = container.parentElement?.clientWidth || 400;
      containerHeight = container.parentElement?.clientHeight || window.innerHeight;
    };

    createParticles();
    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [numberOfSnowflakes]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
        contain: 'strict',
        isolation: 'isolate',
      }}
    />
  );
};

export default ChristmasEffects;
