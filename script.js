const bg = document.getElementById('bg');
const text = document.getElementById('parallax-text');
const fg = document.getElementById('fg');
const ambientGlow = document.querySelector('.ambient-glow');

window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY;
    let windowHeight = window.innerHeight;

    bg.style.transform = `translateY(${scrollPosition * 0.2}px) scale(1.05)`;
    
    let blurAmount = Math.min(scrollPosition / 80, 10);
    bg.style.filter = `blur(${blurAmount}px)`;
    
    if (fg) {
        fg.style.transform = `translateY(${scrollPosition * -0.15}px)`;
    }
    
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
});