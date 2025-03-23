document.addEventListener('DOMContentLoaded', () => {
    initSearchFilters();
    loadSearchResults();
    initSortOptions();
    initPagination();
    initCompareIcons();
});

function initSearchFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const priceInputs = document.querySelectorAll('.price-range input');
    const resetButton = document.querySelector('.reset-filters-btn');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            applyFilters();
        });
    });
    
    priceInputs.forEach(input => {
        input.addEventListener('input', () => {
            applyFilters();
        });
    });
    
    resetButton?.addEventListener('click', () => {
        filterCheckboxes.forEach(checkbox => checkbox.checked = false);
        priceInputs.forEach(input => input.value = '');
        applyFilters();
    });
    
    // Check URL parameters for initial filters
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    const filterParam = urlParams.get('filter');
    
    if (queryParam) {
        document.querySelector('#car-search')?.value = queryParam;
    }
    
    if (filterParam) {
        const filterCheckbox = document.querySelector(`#type-${filterParam}`);
        if (filterCheckbox) filterCheckbox.checked = true;
    }
}

function applyFilters() {
    const selectedBrands = getSelectedValues('brand');
    const selectedTypes = getSelectedValues('type');
    const selectedFuels = getSelectedValues('fuel');
    const selectedTransmissions = getSelectedValues('transmission');
    const selectedSeats = getSelectedValues('seats');
    const minPrice = parseFloat(document.getElementById('price-min')?.value || 0);
    const maxPrice = parseFloat(document.getElementById('price-max')?.value || 100);
    
    let filteredCars = [];
    
    if (typeof carData !== 'undefined') {
        filteredCars = carData.filter(car => {
            // Extract numeric price range (e.g., "₹6.00 - ₹9.10 Lakh" -> [6.00, 9.10])
            const priceMatch = car.price.match(/₹([\d.]+) - ₹([\d.]+)/);
            const carMinPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
            const carMaxPrice = priceMatch ? parseFloat(priceMatch[2]) : 100;
            
            // Check if car matches all selected filters
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(brand => car.brand.toLowerCase().includes(brand));
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.bodyType.toLowerCase());
            const matchesFuel = selectedFuels.length === 0 || selectedFuels.some(fuel => car.fuelType.toLowerCase().includes(fuel));
            const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.some(trans => car.transmission.toLowerCase().includes(trans));
            const matchesSeats = selectedSeats.length === 0 || selectedSeats.some(seat => car.seating.includes(seat));
            const matchesPrice = (minPrice <= carMaxPrice && maxPrice >= carMinPrice);
            
            return matchesBrand && matchesType && matchesFuel && matchesTransmission && matchesSeats && matchesPrice;
        });
    }
    
    updateSearchResults(filteredCars);
}

function getSelectedValues(filterType) {
    const checkboxes = document.querySelectorAll(`input[id^="${filterType}-"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function updateSearchResults(cars) {
    const resultsContainer = document.getElementById('search-results');
    const resultsCount = document.getElementById('results-count');
    
    if (!resultsContainer) return;
    
    // Update results count
    if (resultsCount) resultsCount.textContent = cars.length;
    
    // Sort cars based on selected option
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        sortCars(cars, sortValue);
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (cars.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No cars match your search criteria. Please try different filters.</div>';
        return;
    }
    
    // Display cars
    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');
        
        carCard.innerHTML = `
            <div class="car-image">
                <img src="../assets/images/cars/${car.image}" alt="${car.name}">
            </div>
            <div class="car-details">
                <h3>${car.name}</h3>
                <div class="car-price">${car.price}</div>
                <div class="car-specs">
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${car.mileage}</span>
                    <span><i class="fas fa-cogs"></i> ${car.transmission}</span>
                </div>
                <div class="car-action">
                    <a href="car-details.html?id=${car.id}" class="view-details">View Details</a>
                    <i class="fas fa-balance-scale compare-icon" data-car="${car.id}"></i>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(carCard);
        
        // Add fade-in animation
        setTimeout(() => {
            carCard.classList.add('fade-in');
        }, 50);
    });
    
    initCompareIcons();
}

function sortCars(cars, sortBy) {
    switch (sortBy) {
        case 'price-low':
            cars.sort((a, b) => {
                const priceA = parseFloat(a.price.match(/₹([\d.]+)/)[1]);
                const priceB = parseFloat(b.price.match(/₹([\d.]+)/)[1]);
                return priceA - priceB;
            });
            break;
        case 'price-high':
            cars.sort((a, b) => {
                const priceA = parseFloat(a.price.match(/₹([\d.]+)/)[1]);
                const priceB = parseFloat(b.price.match(/₹([\d.]+)/)[1]);
                return priceB - priceA;
            });
            break;
        case 'mileage':
            cars.sort((a, b) => {
                const mileageA = parseFloat(a.mileage.split(' ')[0]);
                const mileageB = parseFloat(b.mileage.split(' ')[0]);
                return mileageB - mileageA;
            });
            break;
        case 'newest':
            // In a real app, this would sort by release date
            // For demo, we'll just reverse the array
            cars.reverse();
            break;
        default:
            // Default sorting (popularity) - no change
            break;
    }
}

function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query'); // Get search query from URL

    let filteredCars = [...carData]; // Assuming carData is an array of car objects

    // Apply search filter
    if (query) {
        const searchTerm = query.toLowerCase();
        filteredCars = filteredCars.filter(car => 
            car.name.toLowerCase().includes(searchTerm) || 
            car.brand.toLowerCase().includes(searchTerm) ||
            car.bodyType.toLowerCase().includes(searchTerm)
        );

        // Set the search input value (if exists)
        const searchInput = document.getElementById('car-search');
        if (searchInput) {
            searchInput.value = query;
        }
    }

    updateSearchResults(filteredCars);
}


function initSortOptions() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applyFilters();
        });
    }
}

function initPagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const prevButton = document.querySelector('.page-btn.prev');
    const nextButton = document.querySelector('.page-btn.next');
    
    pageButtons.forEach(button => {
        if (!button.classList.contains('prev') && !button.classList.contains('next')) {
            button.addEventListener('click', function() {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                // In a real app, this would load the selected page
                // For demo, we'll just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const activePage = document.querySelector('.page-btn.active:not(.prev):not(.next)');
            if (activePage && activePage.previousElementSibling && !activePage.previousElementSibling.classList.contains('prev')) {
                activePage.previousElementSibling.click();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const activePage = document.querySelector('.page-btn.active:not(.prev):not(.next)');
            if (activePage && activePage.nextElementSibling && !activePage.nextElementSibling.classList.contains('next')) {
                activePage.nextElementSibling.click();
            }
        });
    }
}

function initCompareIcons() {
    const compareIcons = document.querySelectorAll('.compare-icon');
    
    compareIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const carId = this.getAttribute('data-car');
            addToCompare(carId);
        });
    });
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

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
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
    button.href = 'compare.html';
    
    button.innerHTML = `
        <i class="fas fa-balance-scale"></i>
        <span class="count">${count}</span>
        <span class="text">Compare</span>
    `;
    
    document.body.appendChild(button);
    
    setTimeout(() => button.style.transform = 'translateY(0)', 100);
}
document.addEventListener('DOMContentLoaded', () => {
    initSearchFilters();
    loadSearchResults();
    initSortOptions();
    initPagination();
    initCompareIcons();
});

function initSearchFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const priceInputs = document.querySelectorAll('.price-range input');
    const resetButton = document.querySelector('.reset-filters-btn');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            applyFilters();
        });
    });
    
    priceInputs.forEach(input => {
        input.addEventListener('input', () => {
            applyFilters();
        });
    });
    
    resetButton?.addEventListener('click', () => {
        filterCheckboxes.forEach(checkbox => checkbox.checked = false);
        priceInputs.forEach(input => input.value = '');
        applyFilters();
    });
    
    // Check URL parameters for initial filters
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    const filterParam = urlParams.get('filter');
    
    if (queryParam) {
        document.querySelector('#car-search')?.value = queryParam;
    }
    
    if (filterParam) {
        const filterCheckbox = document.querySelector(`#type-${filterParam}`);
        if (filterCheckbox) filterCheckbox.checked = true;
    }
}

function applyFilters() {
    const selectedBrands = getSelectedValues('brand');
    const selectedTypes = getSelectedValues('type');
    const selectedFuels = getSelectedValues('fuel');
    const selectedTransmissions = getSelectedValues('transmission');
    const selectedSeats = getSelectedValues('seats');
    const minPrice = parseFloat(document.getElementById('price-min')?.value || 0);
    const maxPrice = parseFloat(document.getElementById('price-max')?.value || 100);
    
    let filteredCars = [];
    
    if (typeof carData !== 'undefined') {
        filteredCars = carData.filter(car => {
            // Extract numeric price range (e.g., "₹6.00 - ₹9.10 Lakh" -> [6.00, 9.10])
            const priceMatch = car.price.match(/₹([\d.]+) - ₹([\d.]+)/);
            const carMinPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
            const carMaxPrice = priceMatch ? parseFloat(priceMatch[2]) : 100;
            
            // Check if car matches all selected filters
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(brand => car.brand.toLowerCase().includes(brand));
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.bodyType.toLowerCase());
            const matchesFuel = selectedFuels.length === 0 || selectedFuels.some(fuel => car.fuelType.toLowerCase().includes(fuel));
            const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.some(trans => car.transmission.toLowerCase().includes(trans));
            const matchesSeats = selectedSeats.length === 0 || selectedSeats.some(seat => car.seating.includes(seat));
            const matchesPrice = (minPrice <= carMaxPrice && maxPrice >= carMinPrice);
            
            return matchesBrand && matchesType && matchesFuel && matchesTransmission && matchesSeats && matchesPrice;
        });
    }
    
    updateSearchResults(filteredCars);
}

function getSelectedValues(filterType) {
    const checkboxes = document.querySelectorAll(`input[id^="${filterType}-"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function updateSearchResults(cars) {
    const resultsContainer = document.getElementById('search-results');
    const resultsCount = document.getElementById('results-count');
    
    if (!resultsContainer) return;
    
    // Update results count
    if (resultsCount) resultsCount.textContent = cars.length;
    
    // Sort cars based on selected option
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        sortCars(cars, sortValue);
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (cars.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No cars match your search criteria. Please try different filters.</div>';
        return;
    }
    
    // Display cars
    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');
        
        carCard.innerHTML = `
            <div class="car-image">
                <img src="../assets/images/cars/${car.image}" alt="${car.name}">
            </div>
            <div class="car-details">
                <h3>${car.name}</h3>
                <div class="car-price">${car.price}</div>
                <div class="car-specs">
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${car.mileage}</span>
                    <span><i class="fas fa-cogs"></i> ${car.transmission}</span>
                </div>
                <div class="car-action">
                    <a href="car-details.html?id=${car.id}" class="view-details">View Details</a>
                    <i class="fas fa-balance-scale compare-icon" data-car="${car.id}"></i>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(carCard);
        
        // Add fade-in animation
        setTimeout(() => {
            carCard.classList.add('fade-in');
        }, 50);
    });
    
    initCompareIcons();
}

function sortCars(cars, sortBy) {
    switch (sortBy) {
        case 'price-low':
            cars.sort((a, b) => {
                const priceA = parseFloat(a.price.match(/₹([\d.]+)/)[1]);
                const priceB = parseFloat(b.price.match(/₹([\d.]+)/)[1]);
                return priceA - priceB;
            });
            break;
        case 'price-high':
            cars.sort((a, b) => {
                const priceA = parseFloat(a.price.match(/₹([\d.]+)/)[1]);
                const priceB = parseFloat(b.price.match(/₹([\d.]+)/)[1]);
                return priceB - priceA;
            });
            break;
        case 'mileage':
            cars.sort((a, b) => {
                const mileageA = parseFloat(a.mileage.split(' ')[0]);
                const mileageB = parseFloat(b.mileage.split(' ')[0]);
                return mileageB - mileageA;
            });
            break;
        case 'newest':
            // In a real app, this would sort by release date
            // For demo, we'll just reverse the array
            cars.reverse();
            break;
        default:
            // Default sorting (popularity) - no change
            break;
    }
}

function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const filter = urlParams.get('filter');
    
    if (typeof carData !== 'undefined') {
        let filteredCars = [...carData];
        
        // Apply search query if present
        if (query) {
            const searchTerm = query.toLowerCase();
            filteredCars = filteredCars.filter(car => 
                car.name.toLowerCase().includes(searchTerm) || 
                car.brand.toLowerCase().includes(searchTerm) ||
                car.bodyType.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply filter if present
        if (filter) {
            filteredCars = filteredCars.filter(car => 
                car.bodyType.toLowerCase() === filter.toLowerCase()
            );
        }
        
        updateSearchResults(filteredCars);
    }
}

function initSortOptions() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applyFilters();
        });
    }
}

function initPagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const prevButton = document.querySelector('.page-btn.prev');
    const nextButton = document.querySelector('.page-btn.next');
    
    pageButtons.forEach(button => {
        if (!button.classList.contains('prev') && !button.classList.contains('next')) {
            button.addEventListener('click', function() {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                // In a real app, this would load the selected page
                // For demo, we'll just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const activePage = document.querySelector('.page-btn.active:not(.prev):not(.next)');
            if (activePage && activePage.previousElementSibling && !activePage.previousElementSibling.classList.contains('prev')) {
                activePage.previousElementSibling.click();
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const activePage = document.querySelector('.page-btn.active:not(.prev):not(.next)');
            if (activePage && activePage.nextElementSibling && !activePage.nextElementSibling.classList.contains('next')) {
                activePage.nextElementSibling.click();
            }
        });
    }
}

function initCompareIcons() {
    const compareIcons = document.querySelectorAll('.compare-icon');
    
    compareIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const carId = this.getAttribute('data-car');
            addToCompare(carId);
        });
    });
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

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
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
    button.href = 'compare.html';
    
    button.innerHTML = `
        <i class="fas fa-balance-scale"></i>
        <span class="count">${count}</span>
        <span class="text">Compare</span>
    `;
    
    document.body.appendChild(button);
    
    setTimeout(() => button.style.transform = 'translateY(0)', 100);
}
