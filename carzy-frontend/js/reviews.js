document.addEventListener('DOMContentLoaded', function() {
    // Initialize review form
    initReviewForm();
    
    // Load reviews
    loadReviews();
    
    // Initialize filters
    initFilters();
});

function initReviewForm() {
    const reviewForm = document.getElementById('review-form');
    const ratingSelect = document.getElementById('rating-select');
    let selectedRating = 0;
    
    // Handle star rating selection
    if (ratingSelect) {
        const stars = ratingSelect.querySelectorAll('.fa-star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                selectedRating = rating;
                
                // Update visual state
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });
    }
    
    // Handle form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const carId = document.getElementById('car-select').value;
            const reviewerName = document.getElementById('reviewer-name').value;
            const reviewTitle = document.getElementById('review-title').value;
            const reviewContent = document.getElementById('review-content').value;
            
            if (!carId || !reviewerName || !reviewTitle || !reviewContent || selectedRating === 0) {
                showNotification('Please fill all fields and select a rating', 'error');
                return;
            }
            
            // Submit review to API
            fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    car_id: carId,
                    reviewer_name: reviewerName,
                    review_title: reviewTitle,
                    rating: selectedRating,
                    review_content: reviewContent
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit review');
                }
                return response.json();
            })
            .then(data => {
                showNotification('Your review has been submitted successfully!', 'success');
                reviewForm.reset();
                
                // Reset stars
                stars.forEach(s => s.classList.remove('selected'));
                selectedRating = 0;
                
                // Reload reviews to show the new one
                loadReviews();
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                showNotification('Failed to submit review. Please try again later.', 'error');
            });
        });
    }
}

function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    reviewsContainer.innerHTML = '<div class="spinner"></div>';
    
    // Get filter values
    const brandFilter = document.getElementById('brand-filter')?.value || '';
    const ratingFilter = document.getElementById('rating-filter')?.value || '';
    const sortFilter = document.getElementById('sort-filter')?.value || 'latest';
    
    // Build query string
    let queryString = '';
    if (brandFilter) queryString += `brand=${brandFilter}&`;
    if (ratingFilter) queryString += `rating=${ratingFilter}&`;
    queryString += `sort=${sortFilter}`;
    
    fetch(`http://localhost:5000/api/reviews?${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(reviews => {
            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p class="no-reviews">No reviews found matching your criteria.</p>';
                return;
            }
            
            reviewsContainer.innerHTML = '';
            reviews.forEach(review => {
                const reviewCard = createReviewCard(review);
                reviewsContainer.appendChild(reviewCard);
            });
            
            // Initialize pagination if needed
            initPagination(reviews.length);
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            reviewsContainer.innerHTML = '<p>Failed to load reviews. Please try again later.</p>';
        });
}

function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('review-card');
    
    // Generate stars HTML based on rating
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= review.rating) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    
    // Format date
    const reviewDate = new Date(review.created_at);
    const formattedDate = reviewDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                    <img src="../assets/images/avatars/default.jpg" alt="User Avatar">
                </div>
                <div>
                    <h4 class="reviewer-name">${review.reviewer_name}</h4>
                    <span class="review-date">${formattedDate}</span>
                </div>
            </div>
            <div class="review-rating">
                ${starsHtml}
            </div>
        </div>
        
        <h3 class="review-title">${review.review_title}</h3>
        
        <div class="review-content">
            <p>${review.review_content}</p>
        </div>
        
        <div class="review-car">
            <div class="review-car-img">
                <img src="../assets/images/cars/${review.image}" alt="${review.car_name}">
            </div>
            <span class="review-car-name">${review.car_name}</span>
        </div>
    `;
    
    return reviewCard;
}

function initFilters() {
    const brandFilter = document.getElementById('brand-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // Add event listeners to filters
    [brandFilter, ratingFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', loadReviews);
        }
    });
}

function initPagination(totalReviews) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    const reviewsPerPage = 5;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);
    
    // Update pagination buttons
    const pageButtons = pagination.querySelectorAll('.page-btn:not(.prev):not(.next)');
    
    // Clear existing page buttons except prev and next
    pageButtons.forEach(btn => {
        if (!btn.classList.contains('prev') && !btn.classList.contains('next')) {
            btn.remove();
        }
    });
    
    // Add page buttons
    const nextBtn = pagination.querySelector('.next');
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page-btn');
        if (i === 1) pageBtn.classList.add('active');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            // Handle page change
            document.querySelectorAll('.pagination .page-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Implement page change logic here
        });
        pagination.insertBefore(pageBtn, nextBtn);
    }
    
    // Handle prev/next buttons
    const prevBtn = pagination.querySelector('.prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const activeBtn = pagination.querySelector('.page-btn.active');
            if (activeBtn && activeBtn.previousElementSibling && !activeBtn.previousElementSibling.classList.contains('prev')) {
                activeBtn.previousElementSibling.click();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const activeBtn = pagination.querySelector('.page-btn.active');
            if (activeBtn && activeBtn.nextElementSibling && !activeBtn.nextElementSibling.classList.contains('next')) {
                activeBtn.nextElementSibling.click();
            }
        });
    }
}

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    notification.querySelector('.notification-close')?.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.parentNode && notification.remove(), 300);
        }
    }, 3000);
}
