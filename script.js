const bg = document.getElementById('bg');
const text = document.getElementById('parallax-text');
const fg = document.getElementById('fg');
const ambientGlow = document.querySelector('.ambient-glow');
const motionElements = document.querySelectorAll('.cafe-steam, .ambient-spark');

window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;

    // Background parallax and blur
    bg.style.transform = `translateY(${scrollPosition * -0.05}px) scale(1.05)`;
    let blurAmount = Math.min(scrollPosition / 80, 10);
    bg.style.filter = `blur(${blurAmount}px)`;
    
    // FADE OUT FOREGROUND (f.jpeg)
    if (fg) {
        fg.style.transform = `translateY(${scrollPosition * -0.15}px)`;
        // Start fading immediately, completely invisible by 80% of the screen height
        let fgOpacity = Math.max(1 - (scrollPosition / (windowHeight * 0.8)), 0);
        fg.style.opacity = fgOpacity;
    }
    
    // FADE OUT TEXT MASK
    const textMask = document.querySelector('.text-mask-wrapper');
    if (textMask) {
        let maskOpacity = Math.max(1 - (scrollPosition / (windowHeight * 0.8)), 0);
        textMask.style.opacity = maskOpacity;
    }
    
    // Existing Text parallax logic
    let textDrop = scrollPosition * 0.35;
    let fadeOutStart = windowHeight * 0.3;
    let opacity = 1;
    
    if (scrollPosition > fadeOutStart) {
        opacity = Math.max(1 - ((scrollPosition - fadeOutStart) / 600), 0);
    }
    text.style.transform = `translateY(${textDrop}px)`;
    text.style.opacity = opacity;

    if (ambientGlow) {
        let shiftY = 50 + (scrollPosition * 0.05);
        ambientGlow.style.background = `radial-gradient(circle at 50% ${shiftY}%, rgba(127, 29, 29, 0.110) 0%, rgba(127, 29, 29, 0) 70%)`;
    }

    // NEW: Scroll-based background effects for motion graphics
// NEW: Scroll-based background effects for elegant motion graphics
    if (motionElements.length > 0) {
        motionElements.forEach((el, index) => {
            let activeScroll = Math.max(0, scrollPosition - windowHeight);
            
            // Sparks move slightly faster than the steam to create parallax depth
            let isSpark = el.classList.contains('ambient-spark');
            let speed = isSpark ? (index + 1) * -0.15 : (index + 1) * -0.05; 
            
            el.style.setProperty('--scroll-offset', `${activeScroll * speed}px`);
        });
    }
});

const revealOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'grid-layout') {
                entry.target.classList.add('arrow-revealed');
            }
            
            if (entry.target.classList.contains('card') || entry.target.classList.contains('memory-card')) {
                const siblings = Array.from(entry.target.parentNode.children).filter(el => el.classList.contains(entry.target.classList[0]));
                const index = siblings.indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 150);
            } else {
                entry.target.classList.add('revealed');
            }
            
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.card, .memory-card, .upcoming-container, #grid-layout, .meetup-header, .section-label, .section-title').forEach(el => {
    revealObserver.observe(el);
});

const nodCard = document.querySelector('.bottom-card');
const noddingHead = document.querySelector('.nodding-head');

if (nodCard && noddingHead) {
    nodCard.addEventListener('mousemove', (e) => {
        const rect = nodCard.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const percentage = (y / rect.height) - 0.5;
        const rotation = percentage * 30;
        
        noddingHead.style.transform = `rotate(${rotation}deg)`;
        noddingHead.style.transition = 'transform 0.1s ease-out';
    });

    nodCard.addEventListener('mouseleave', () => {
        noddingHead.style.transform = `rotate(0deg)`;
        noddingHead.style.transition = 'transform 0.6s var(--ease-elegant)';
    });
}

document.querySelectorAll('.card, .memory-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (!card.classList.contains('revealed')) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        
        card.style.transition = 'none';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 20}px 40px var(--crimson-glow)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'all 1s var(--ease-elegant)';
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

const scrollThread = document.querySelector('.scroll-thread');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    const scrollPercentRounded = Math.round(scrollPercent * 100);
    
    if (scrollThread) {
        scrollThread.style.height = `${scrollPercentRounded}%`;
    }

    // (Keep your existing text and background JS above this...)

    // NEW: Motion Graphics logic
    const motionContainer = document.querySelector('.motion-graphics-container');
    const motionElements = document.querySelectorAll('.cafe-steam, .ambient-spark');

 if (motionContainer) {
        // Fade in the motion shapes once you scroll halfway down the hero section
        if (scrollTop > winHeight * 0.5) { 
            motionContainer.style.opacity = '1';
        } else {
            motionContainer.style.opacity = '0';
        }
    }

});

// --- Cinematic Hero Scroll Snap ---

let isAutoScrolling = false;
let touchStartY = 0;

// Function to handle the smooth jump with CUSTOM speed
function snapToNextSection() {
    if (isAutoScrolling) return; // Prevent overlapping triggers
    isAutoScrolling = true;

    const targetPosition = window.innerHeight; // 1 viewport height down
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    
    // ---> CHANGE THIS VALUE TO ADJUST SPEED <---
    // 1500 = 1.5 seconds. Increase the number to make it slower.
    const duration = 2700; 
    
    let start = null;

    // Custom animation loop
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Elegant easing function (easeInOutCubic) to match your site's vibe
        const ease = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            // Unlock scrolling shortly after the animation finishes
            setTimeout(() => {
                isAutoScrolling = false;
            }, 100); 
        }
    }

    requestAnimationFrame(animation);
}

// 1. Desktop: Mouse Wheel & Trackpad
window.addEventListener('wheel', (e) => {
    // If animation is running, block native scrolling to prevent the vibration/glitch
    if (isAutoScrolling) {
        e.preventDefault();
        return;
    }

    // If user is within the top section and scrolling down
    if (window.scrollY < 890 && e.deltaY > 0) {
        e.preventDefault(); // Stop the default jerky scroll
        snapToNextSection();
    }
}, { passive: false }); 

// 2. Mobile: Touch Swipe
window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    // If animation is running, block native touch scrolling
    if (isAutoScrolling) {
        e.preventDefault();
        return;
    }

    let touchEndY = e.changedTouches[0].screenY;
    let isScrollingDown = touchStartY > (touchEndY + 10); // 10px threshold

    // If user is within the top section and swiping up (scrolling down)
    if (window.scrollY < 890 && isScrollingDown) {
        e.preventDefault(); // Stop native scroll from fighting the animation
        snapToNextSection();
    }
}, { passive: false }); // NOTE: Changed to false so preventDefault() works on mobile

// --- FAQ Accordion Logic ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Optional: Close other open FAQs
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle the clicked one
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Update the existing IntersectionObserver setup to include the new FAQ items
document.querySelectorAll('.faq-item').forEach((el, index) => {
    // Add staggered delay for FAQ items
    el.style.transitionDelay = `${index * 100}ms`;
    revealObserver.observe(el);
});
