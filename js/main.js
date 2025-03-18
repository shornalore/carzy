let carsData = [], filteredCars = [], currentPage = 1, carsPerPage = 6;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearchBar();
    initFilterButtons();
    initScrollToTop();
    document.querySelector('.featured-cars') && loadFeaturedCars();
    document.querySelector('.car-details-content') && loadCarDetails();
});

function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle'), nav = document.querySelector('.nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        document.addEventListener('click', e => {
            if (nav.classList.contains('active') && !e.target.closest('.nav') && !e.target.closest('.menu-toggle')) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

function initSearchBar() {
    const searchBar = document.querySelector('.search-bar'), searchBtn = document.querySelector('.search-btn');
    if (searchBar && searchBtn) {
        const searchInput = searchBar.querySelector('input');
        searchBtn.addEventListener('click', () => searchInput?.value.trim() && (window.location.href = 'pages/search.html?query=' + encodeURIComponent(searchInput.value.trim())));
        searchInput?.addEventListener('keypress', e => e.key === 'Enter' && searchInput.value.trim() && (window.location.href = 'pages/search.html?query=' + encodeURIComponent(searchInput.value.trim())));
    }
}

function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => window.location.href = 'pages/search.html?filter=' + button.getAttribute('data-filter'));
    });
}

function loadFeaturedCars() {
    const carsContainer = document.querySelector('.featured-cars .cars-container');
    if (!carsContainer) return;
    carsContainer.innerHTML = '<div class="spinner"></div>';
    setTimeout(() => {
        if (typeof carData !== 'undefined') {
            carsContainer.innerHTML = '';
            carData.slice(0, 6).forEach(car => {
                const carCard = createCarCard(car);
                carsContainer.appendChild(carCard);
                setTimeout(() => carCard.classList.add('fade-in'), 100);
            });
        } else {
            carsContainer.innerHTML = '<p>Failed to load car data. Please try again later.</p>';
        }
    }, 800);
}

function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.classList.add('car-card');
    carCard.innerHTML = `
        <div class="car-image"><img src="assets/images/cars/${car.image}" alt="${car.name}"></div>
        <div class="car-details">
            <h3>${car.name}</h3>
            <div class="car-price">${car.price}</div>
            <div class="car-specs">
                <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                <span><i class="fas fa-tachometer-alt"></i> ${car.mileage}</span>
                <span><i class="fas fa-cogs"></i> ${car.transmission}</span>
            </div>
            <div class="car-action">
                <a href="pages/car-details.html?id=${car.id}" class="view-details">View Details</a>
                <i class="fas fa-balance-scale compare-icon" data-car="${car.id}"></i>
            </div>
        </div>`;
    carCard.querySelector('.compare-icon')?.addEventListener('click', () => addToCompare(car.id));
    return carCard;
}

function addToCompare(carId) {
    let compareList = JSON.parse(localStorage.getItem('compareList')) || [];
    if (compareList.includes(carId)) {
        showNotification('This car is already in your comparison list');
        return;
    }
    if (compareList.length >= 3) {
        showNotification('You can compare up to 3 cars at once. Please remove a car first.');
        return;
    }
    compareList.push(carId);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    showNotification('Car added to comparison list', 'success');
    updateCompareButton();
}

function updateCompareButton() {
    const compareButton = document.querySelector('.compare-floating-btn');
    const compareList = JSON.parse(localStorage.getItem('compareList')) || [];
    if (compareButton) {
        if (compareList.length > 0) {
            compareButton.classList.add('active');
            compareButton.querySelector('.count').textContent = compareList.length;
        } else {
            compareButton.classList.remove('active');
        }
    } else if (compareList.length > 0) {
        createFloatingCompareButton(compareList.length);
    }
}

function createFloatingCompareButton(count) {
    const button = document.createElement('a');
    button.classList.add('compare-floating-btn', 'active');
    button.href = 'pages/compare.html';
    button.innerHTML = `
        <i class="fas fa-balance-scale"></i>
        <span class="count">${count}</span>
        <span class="text">Compare</span>`;
    document.body.appendChild(button);
    setTimeout(() => button.style.transform = 'translateY(0)', 100);
}

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
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

function loadCarDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    if (!carId) return window.location.href = '../index.html';
    if (typeof carData !== 'undefined') {
        const car = carData.find(c => c.id === carId);
        if (car) {
            document.title = `${car.name} - Carzy`;
            document.getElementById('car-breadcrumb')?.textContent = car.name;
            document.getElementById('car-name').textContent = car.name;
            document.getElementById('car-price').textContent = car.price;
            document.getElementById('main-car-image').src = `../assets/images/cars/${car.image}`;
            document.getElementById('main-car-image').alt = car.name;
            document.getElementById('fuel-type').textContent = car.fuelType;
            document.getElementById('engine').textContent = car.engine;
            document.getElementById('transmission').textContent = car.transmission;
            document.getElementById('seating').textContent = car.seating;
            document.getElementById('mileage').textContent = car.mileage;
            document.getElementById('body-type').textContent = car.bodyType;
            document.getElementById('car-description').textContent = car.description || 'No description available for this car.';
            loadCarGallery(car);
            loadSpecificationsTab(car);
            loadFeaturesTab(car);
            loadVariantsTab(car);
            loadReviewsTab(car);
            loadSimilarCars(car);
            initTabs();
        } else {
            window.location.href = '../index.html';
        }
    }
}

function loadCarGallery(car) {
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    if (!thumbnailContainer) return;
    thumbnailContainer.innerHTML = '';
    const mainThumbnail = document.createElement('div');
    mainThumbnail.classList.add('thumbnail', 'active');
    mainThumbnail.innerHTML = `<img src="../assets/images/cars/${car.image}" alt="${car.name}">`;
    thumbnailContainer.appendChild(mainThumbnail);
    car.gallery?.length > 0 && car.gallery.forEach(image => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.innerHTML = `<img src="../assets/images/cars/gallery/${image}" alt="${car.name}">`;
        thumbnailContainer.appendChild(thumbnail);
    });
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-car-image');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const thumbImg = this.querySelector('img');
            mainImage.src = thumbImg.src;
            mainImage.style.opacity = '0';
            setTimeout(() => mainImage.style.opacity = '1', 50);
        });
    });
}

function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
}
