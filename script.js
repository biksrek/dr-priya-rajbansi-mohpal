/**
 * Doctor Website Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    // 3. Reveal Animations on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Update active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 5. Testimonials Carousel
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(track ? track.children : []);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.slider-dots');

    if (track && slides.length > 0) {
        // Setup initial position
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        // Ensure resizing recalculates width
        window.addEventListener('resize', () => {
             slideWidth = slides[0].getBoundingClientRect().width;
             moveToSlide(currentIndex);
        });

        // Create dots based on number of slides
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsNav.appendChild(dot);
        });
        
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            if (targetIndex < 0) {
                targetIndex = slides.length - 1; // Wrap around backwards
            } else if (targetIndex >= slides.length) {
                targetIndex = 0; // Wrap around forwards
            }
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            
            // Update dots
            dots.forEach(d => d.classList.remove('active'));
            dots[targetIndex].classList.add('active');
            
            currentIndex = targetIndex;
        };

        // Next Button Click
        nextButton.addEventListener('click', e => moveToSlide(currentIndex + 1));

        // Prev Button Click
        prevButton.addEventListener('click', e => moveToSlide(currentIndex - 1));

        // Dot Click
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('.dot');
            if (!targetDot) return;
            const targetIndex = parseInt(targetDot.dataset.index);
            moveToSlide(targetIndex);
        });

        // Optional: Auto-play functionality
        setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000); // changes every 5 seconds
    }

    // 6. Contact Form WhatsApp Integration
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const reason = document.getElementById('reason').value;
            
            // Construct message
            const message = `Hello Dr. Das! I would like to request an appointment.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Preferred Date:* ${date}%0A*Reason:* ${reason}`;
            
            // Open WhatsApp
            window.open(`https://wa.me/919832086088?text=${message}`, '_blank');
            
            // Optional: reset form
            appointmentForm.reset();
        });
    }
});
