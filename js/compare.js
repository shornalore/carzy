/**
 * compare.js
 * 
 * This file handles the car comparison functionality for the Carzy web application.
 * It allows users to select and compare multiple cars side by side.
 * 
 * Developed by: Akshat Jain, Krishanu Barman, Aditya Nath
 * Last updated: March 18, 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize comparison functionality
    initCompareCarSelection();
    initCompareActions();
    initPopularComparisons();
    initCarSelectionModal();
});

/**
 * Initialize the car selection slots for comparison
 */
function initCompareCarSelection() {
    const compareSlots = document.querySelectorAll('.compare-car-empty');
    
    compareSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Store the current slot ID to know which slot to fill
            window.currentCompareSlot = this.id;
            
            // Open car selection modal
            const modal = document.getElementById('car-selection-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Load cars in the modal
                loadCarsForSelection();
            }
        });
    });
}

/**
 * Load cars for selection in the modal
 */
function loadCarsForSelection() {
    const selectionGrid = document.getElementById('car-selection-grid');
    
    if (!selectionGrid) return;
    
    // Clear previous content
    selectionGrid.innerHTML = '';
    
    // Get cars from the data.js file (assumed to be available globally)
    if (typeof carData !== 'undefined') {
        carData.forEach(car => {
            const carCard = document.createElement('div');
            carCard.classList.add('car-selection-card');
            carCard.setAttribute('data-car-id', car.id);
            
            carCard.innerHTML = `
                <div class="car-selection-img">
                    <img src="../assets/images/cars/${car.image}" alt="${car.name}">
                </div>
                <div class="car-selection-info">
                    <h4>${car.name}</h4>
                    <p>${car.price}</p>
                </div>
            `;
            
            // Add click event to select this car
            carCard.addEventListener('click', function() {
                selectCarForComparison(car);
            });
            
            selectionGrid.appendChild(carCard);
        });
    } else {
        // Fallback if car data is not available
        selectionGrid.innerHTML = '<p>Car data is not available. Please try again later.</p>';
    }
}

/**
 * Handle car selection for comparison
 */
function selectCarForComparison(car) {
    const slotId = window.currentCompareSlot;
    const slot = document.getElementById(slotId);
    
    if (slot) {
        // Update the slot with selected car info
        slot.classList.remove('compare-car-empty');
        slot.setAttribute('data-car-id', car.id);
        
        slot.innerHTML = `
            <div class="selected-car-img">
                <img src="../assets/images/cars/${car.image}" alt="${car.name}">
            </div>
            <h4>${car.name}</h4>
            <p>${car.price}</p>
            <button class="remove-car-btn" onclick="removeCarFromComparison('${slotId}', event)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Close the modal
        const modal = document.getElementById('car-selection-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Show compare actions if at least two cars are selected
        updateCompareActions();
    }
}

/**
 * Remove a car from comparison
 */
function removeCarFromComparison(slotId, event) {
    // Prevent the click from bubbling to the parent (which would open the modal)
    event.stopPropagation();
    
    const slot = document.getElementById(slotId);
    
    if (slot) {
        // Reset the slot to empty state
        slot.classList.add('compare-car-empty');
        slot.removeAttribute('data-car-id');
        
        slot.innerHTML = `
            <i class="fas fa-plus"></i>
            <p>Select Car ${slotId.split('-')[2]}</p>
        `;
        
        // Update compare actions visibility
        updateCompareActions();
    }
}

/**
 * Update the visibility of compare actions based on selected cars
 */
function updateCompareActions() {
    const compareActions = document.querySelector('.compare-actions');
    const selectedCars = document.querySelectorAll('.compare-car:not(.compare-car-empty)');
    
    if (compareActions) {
        if (selectedCars.length >= 2) {
            compareActions.style.display = 'flex';
        } else {
            compareActions.style.display = 'none';
            
            // Also hide results if showing
            const compareResults = document.querySelector('.compare-results');
            if (compareResults) {
                compareResults.style.display = 'none';
            }
        }
    }
}

/**
 * Initialize compare and reset buttons
 */
function initCompareActions() {
    const compareBtn = document.getElementById('compare-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            performComparison();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetComparison();
        });
    }
}

/**
 * Perform the comparison between selected cars
 */
function performComparison() {
    const selectedCars = document.querySelectorAll('.compare-car:not(.compare-car-empty)');
    const compareResults = document.querySelector('.compare-results');
    
    if (selectedCars.length < 2 || !compareResults) return;
    
    // Show the results section
    compareResults.style.display = 'block';
    
    // Scroll to results
    compareResults.scrollIntoView({ behavior: 'smooth' });
    
    // Get car IDs
    const carIds = Array.from(selectedCars).map(slot => slot.getAttribute('data-car-id'));
    
    // Populate comparison table with car data
    if (typeof carData !== 'undefined') {
        carIds.forEach((carId, index) => {
            const car = carData.find(c => c.id === carId);
            
            if (car) {
                // Update car names in table headers
                document.getElementById(`car${index+1}-name`).textContent = car.name;
                document.getElementById(`car${index+1}-name-features`).textContent = car.name;
                
                // Update specifications
                document.getElementById(`car${index+1}-brand`).textContent = car.brand;
                document.getElementById(`car${index+1}-price`).textContent = car.price;
                document.getElementById(`car${index+1}-engine`).textContent = car.engine;
                document.getElementById(`car${index+1}-fuel`).textContent = car.fuelType;
                document.getElementById(`car${index+1}-transmission`).textContent = car.transmission;
                document.getElementById(`car${index+1}-mileage`).textContent = car.mileage;
                document.getElementById(`car${index+1}-seating`).textContent = car.seating;
                document.getElementById(`car${index+1}-body`).textContent = car.bodyType;
                document.getElementById(`car${index+1}-safety`).textContent = car.safetyRating || 'N/A';
                document.getElementById(`car${index+1}-boot`).textContent = car.bootSpace || 'N/A';
                document.getElementById(`car${index+1}-ground`).textContent = car.groundClearance || 'N/A';
                
                // Update features
                document.getElementById(`car${index+1}-ac`).textContent = car.features?.ac ? 'Yes' : 'No';
                document.getElementById(`car${index+1}-power-steering`).textContent = car.features?.powerSteering ? 'Yes' : 'No';
                document.getElementById(`car${index+1}-power-windows`).textContent = car.features?.powerWindows ? 'Yes' : 'No';
                document.getElementById(`car${index+1}-abs`).textContent = car.features?.abs ? 'Yes' : 'No';
                document.getElementById(`car${index+1}-airbags`).textContent = car.features?.airbags || 'No';
                document.getElementById(`car${index+1}-infotainment`).textContent = car.features?.infotainment ? 'Yes' : 'No';
                document.getElementById(`car${index+1}-parking`).textContent = car.features?.parkingSensors ? 'Yes' : 'No';
                document.getElementById(`car${index+1}-sunroof`).textContent = car.features?.sunroof ? 'Yes' : 'No';
            }
        });
        
        // Clear data for unused slots
        for (let i = carIds.length + 1; i <= 3; i++) {
            document.getElementById(`car${i}-name`).textContent = '-';
            document.getElementById(`car${i}-name-features`).textContent = '-';
            document.getElementById(`car${i}-brand`).textContent = '-';
            document.getElementById(`car${i}-price`).textContent = '-';
            document.getElementById(`car${i}-engine`).textContent = '-';
            document.getElementById(`car${i}-fuel`).textContent = '-';
            document.getElementById(`car${i}-transmission`).textContent = '-';
            document.getElementById(`car${i}-mileage`).textContent = '-';
            document.getElementById(`car${i}-seating`).textContent = '-';
            document.getElementById(`car${i}-body`).textContent = '-';
            document.getElementById(`car${i}-safety`).textContent = '-';
            document.getElementById(`car${i}-boot`).textContent = '-';
            document.getElementById(`car${i}-ground`).textContent = '-';
            
            document.getElementById(`car${i}-ac`).textContent = '-';
            document.getElementById(`car${i}-power-steering`).textContent = '-';
            document.getElementById(`car${i}-power-windows`).textContent = '-';
            document.getElementById(`car${i}-abs`).textContent = '-';
            document.getElementById(`car${i}-airbags`).textContent = '-';
            document.getElementById(`car${i}-infotainment`).textContent = '-';
            document.getElementById(`car${i}-parking`).textContent = '-';
            document.getElementById(`car${i}-sunroof`).textContent = '-';
        }
        
        // Highlight differences
        highlightDifferences();
    }
}

/**
 * Highlight differences between compared cars
 */
function highlightDifferences() {
    const comparisonRows = document.querySelectorAll('.compare-table tr:not(:first-child)');
    
    comparisonRows.forEach(row => {
        const cells = row.querySelectorAll('td:not(:first-child)');
        const values = Array.from(cells).map(cell => cell.textContent);
        
        // Filter out empty values
        const activeValues = values.filter(val => val !== '-');
        
        // Check if all active values are the same
        const allSame = activeValues.every(val => val === activeValues[0]);
        
        // If values are different, highlight them
        if (!allSame && activeValues.length > 1) {
            cells.forEach(cell => {
                if (cell.textContent !== '-') {
                    cell.classList.add('highlight-diff');
                }
            });
        } else {
            cells.forEach(cell => {
                cell.classList.remove('highlight-diff');
            });
        }
    });
}

/**
 * Reset the comparison
 */
function resetComparison() {
    // Reset all slots to empty state
    const slots = document.querySelectorAll('.compare-car');
    
    slots.forEach((slot, index) => {
        slot.classList.add('compare-car-empty');
        slot.removeAttribute('data-car-id');
        
        slot.innerHTML = `
            <i class="fas fa-plus"></i>
            <p>Select Car ${index + 1}</p>
        `;
    });
    
    // Hide compare actions and results
    const compareActions = document.querySelector('.compare-actions');
    const compareResults = document.querySelector('.compare-results');
    
    if (compareActions) {
        compareActions.style.display = 'none';
    }
    
    if (compareResults) {
        compareResults.style.display = 'none';
    }
}

/**
 * Initialize popular comparisons section
 */
function initPopularComparisons() {
    const popularComparisonButtons = document.querySelectorAll('.compare-now-btn');
    
    popularComparisonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const comparisonCard = this.closest('.comparison-card');
            const carImages = comparisonCard.querySelectorAll('.comparison-car img');
            const carNames = comparisonCard.querySelectorAll('.comparison-car h4');
            
            // Reset current comparison
            resetComparison();
            
            // Get car IDs from data based on names
            if (typeof carData !== 'undefined' && carNames.length >= 2) {
                const car1Name = carNames[0].textContent;
                const car2Name = carNames[1].textContent;
                
                const car1 = carData.find(car => car.name === car1Name);
                const car2 = carData.find(car => car.name === car2Name);
                
                if (car1 && car2) {
                    // Fill the first two slots with these cars
                    const slot1 = document.getElementById('compare-car-1');
                    const slot2 = document.getElementById('compare-car-2');
                    
                    if (slot1 && slot2) {
                        // Update slot 1
                        slot1.classList.remove('compare-car-empty');
                        slot1.setAttribute('data-car-id', car1.id);
                        slot1.innerHTML = `
                            <div class="selected-car-img">
                                <img src="../assets/images/cars/${car1.image}" alt="${car1.name}">
                            </div>
                            <h4>${car1.name}</h4>
                            <p>${car1.price}</p>
                            <button class="remove-car-btn" onclick="removeCarFromComparison('compare-car-1', event)">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        
                        // Update slot 2
                        slot2.classList.remove('compare-car-empty');
                        slot2.setAttribute('data-car-id', car2.id);
                        slot2.innerHTML = `
                            <div class="selected-car-img">
                                <img src="../assets/images/cars/${car2.image}" alt="${car2.name}">
                            </div>
                            <h4>${car2.name}</h4>
                            <p>${car2.price}</p>
                            <button class="remove-car-btn" onclick="removeCarFromComparison('compare-car-2', event)">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        
                        // Show compare actions
                        updateCompareActions();
                        
                        // Scroll to comparison section
                        document.querySelector('.compare-container').scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
}

/**
 * Initialize car selection modal
 */
function initCarSelectionModal() {
    const modal = document.getElementById('car-selection-modal');
    const closeButton = document.getElementById('modal-close');
    const carSearch = document.getElementById('car-search');
    const brandFilter = document.getElementById('brand-filter');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
    
    // Close modal when clicking outside content
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                setTimeout(() => {
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
    
    // Search functionality
    if (carSearch) {
        carSearch.addEventListener('input', function() {
            filterCars();
        });
    }
    
    // Brand filter
    if (brandFilter) {
        brandFilter.addEventListener('change', function() {
            filterCars();
        });
    }
}

/**
 * Filter cars in selection modal based on search and brand filter
 */
function filterCars() {
    const searchInput = document.getElementById('car-search');
    const brandFilter = document.getElementById('brand-filter');
    const carCards = document.querySelectorAll('.car-selection-card');
    
    if (!searchInput || !brandFilter || !carCards.length) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const brandTerm = brandFilter.value.toLowerCase();
    
    carCards.forEach(card => {
        const carName = card.querySelector('h4').textContent.toLowerCase();
        const carId = card.getAttribute('data-car-id');
        
        // Find car in data to get brand
        let carBrand = '';
        if (typeof carData !== 'undefined') {
            const car = carData.find(c => c.id === carId);
            if (car) {
                carBrand = car.brand.toLowerCase();
            }
        }
        
        // Check if car matches both filters
        const matchesSearch = carName.includes(searchTerm);
        const matchesBrand = brandTerm === '' || carBrand.includes(brandTerm);
        
        if (matchesSearch && matchesBrand) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
