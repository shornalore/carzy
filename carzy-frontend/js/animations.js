/**
 * animations.js
 * 
 * This file contains all the animations and transitions for the Carzy web application.
 * It enhances user experience with smooth, modern animations for various interactions.
 * 
 * Developed by: Akshat Jain, Krishanu Barman, Aditya Nath
 * Last updated: March 18, 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initHeaderAnimations();
    initPageTransitions();
    initCardAnimations();
    initModalAnimations();
    initTabAnimations();
    initScrollAnimations();
    initButtonAnimations();
    initMenuToggle();
    initSearchBar();
    initRatingSelect();
});

/**
 * Header animations including sticky header and navigation effects
 */
function initHeaderAnimations() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav a');
    
    // Sticky header on scroll
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
            
            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollTop) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Navigation link hover effect
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transition = 'color 0.3s ease';
                this.style.color = 'var(--primary-color)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transition = 'color 0.3s ease';
                this.style.color = 'var(--light-text)';
            }
        });
    });
}

/**
 * Smooth page transitions when navigating between pages
 */
function initPageTransitions() {
    // Add fade-out class to body when leaving the page
    document.querySelectorAll('a').forEach(link => {
        // Only apply to internal links
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', function(e) {
                // Don't apply to links with specific classes or targets
                if (this.classList.contains('no-transition') || this.getAttribute('target') === '_blank') {
                    return;
                }
                
                e.preventDefault();
                const destination = this.href;
                
                // Fade out
                document.body.classList.add('fade-out');
                
                // Navigate after animation completes
                setTimeout(function() {
                    window.location.href = destination;
                }, 300);
            });
        }
    });
    
    // Fade in when page loads
    window.addEventListener('pageshow', function() {
        document.body.classList.add('fade-in');
        setTimeout(function() {
            document.body.classList.remove('fade-in');
        }, 500);
    });
}

/**
 * Animations for car cards and other card elements
 */
function initCardAnimations() {
    // Car cards hover effects
    const carCards = document.querySelectorAll('.car-card');
    
    carCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
            
            // Zoom image slightly
            const image = this.querySelector('.car-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
            
            // Reset image zoom
            const image = this.querySelector('.car-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
    
    // Feature cards and brand cards animations
    const animatedCards = document.querySelectorAll('.feature-card, .brand-card, .comparison-card');
    
    animatedCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
}

/**
 * Modal animations for popups and dialogs
 */
function initModalAnimations() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    // Open modal with animation
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                // Fade in and slide up animation
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal with animation
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            
            // Fade out and slide down animation
            modal.classList.remove('active');
            
            setTimeout(() => {
                modal.style.display = 'none';
                // Restore body scrolling
                document.body.style.overflow = '';
            }, 300);
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                // Fade out and slide down animation
                this.classList.remove('active');
                
                setTimeout(() => {
                    this.style.display = 'none';
                    // Restore body scrolling
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    });
}

/**
 * Tab switching animations for detail pages
 */
function initTabAnimations() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.style.opacity = '0';
                setTimeout(() => {
                    pane.classList.remove('active');
                }, 200);
            });
            
            // Add active class to current button
            this.classList.add('active');
            
            // Show the selected tab with fade-in animation
            const activePane = document.getElementById(tabId);
            if (activePane) {
                setTimeout(() => {
                    activePane.classList.add('active');
                    setTimeout(() => {
                        activePane.style.opacity = '1';
                    }, 50);
                }, 200);
            }
        });
    });
}

/**
 * Scroll animations for elements appearing as user scrolls
 */
function initScrollAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animateOnScroll = function() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    };
    
    // Initial check on page load
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
}

/**
 * Button animations for hover and click effects
 */
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn, .filter-btn, .page-btn');
    
    buttons.forEach(button => {
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Mobile menu toggle animation
 */
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            // Toggle menu icon
            this.classList.toggle('active');
            
            // Toggle navigation
            nav.classList.toggle('active');
            
            // Toggle body scroll
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Search bar animations
 */
function initSearchBar() {
    const searchIcon = document.querySelector('.search-icon');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // Create and show search overlay
            if (!document.querySelector('.search-overlay')) {
                const searchOverlay = document.createElement('div');
                searchOverlay.classList.add('search-overlay');
                
                const searchContainer = document.createElement('div');
                searchContainer.classList.add('search-container');
                
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Search for cars, brands, or models...';
                searchInput.classList.add('search-input');
                
                const closeButton = document.createElement('span');
                closeButton.innerHTML = '&times;';
                closeButton.classList.add('search-close');
                
                searchContainer.appendChild(searchInput);
                searchContainer.appendChild(closeButton);
                searchOverlay.appendChild(searchContainer);
                document.body.appendChild(searchOverlay);
                
                // Animate search overlay
                setTimeout(() => {
                    searchOverlay.style.opacity = '1';
                    searchContainer.style.transform = 'translateY(0)';
                    searchInput.focus();
                }, 10);
                
                // Close search overlay
                closeButton.addEventListener('click', function() {
                    searchOverlay.style.opacity = '0';
                    searchContainer.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        document.body.removeChild(searchOverlay);
                    }, 300);
                });
            }
        });
    }
}

/**
 * Rating selection animation for review form
 */
function initRatingSelect() {
    const ratingSelect = document.getElementById('rating-select');
    
    if (ratingSelect) {
        const stars = ratingSelect.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Highlight stars up to the hovered one
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Set the selected rating
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
                
                // Add hidden input with rating value
                let ratingInput = document.getElementById('rating-value');
                if (!ratingInput) {
                    ratingInput = document.createElement('input');
                    ratingInput.type = 'hidden';
                    ratingInput.id = 'rating-value';
                    ratingInput.name = 'rating';
                    ratingSelect.appendChild(ratingInput);
                }
                ratingInput.value = rating;
            });
        });
        
        // Reset stars when mouse leaves the container
        ratingSelect.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.classList.remove('active');
                
                // Keep selected stars highlighted
                if (s.classList.contains('selected')) {
                    s.classList.add('active');
                }
            });
        });
    }
}
