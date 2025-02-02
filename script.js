// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Set default values for the booking form
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;

    // Set default time to current time (rounded to nearest half hour)
    const fromTimeInput = document.getElementById('fromTime');
    const now = new Date();
    
    // Round minutes to nearest 30
    let minutes = now.getMinutes();
    minutes = Math.ceil(minutes/30) * 30;
    now.setMinutes(minutes);
    
    // Format time as HH:mm
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    fromTimeInput.value = `${hours}:${mins}`;

    // Set default end time to 1 hour after start time
    const toTimeInput = document.getElementById('toTime');
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + 1);
    const endHours = String(endTime.getHours()).padStart(2, '0');
    const endMins = String(endTime.getMinutes()).padStart(2, '0');
    toTimeInput.value = `${endHours}:${endMins}`;

    // Set default location to first option
    const locationSelect = document.getElementById('location');
    if (locationSelect.options.length > 1) {
        locationSelect.selectedIndex = 1; // Select first non-placeholder option
    }
});

// Form validation and submission
document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get form values
    const gameId = document.getElementById('gameId').value;
    const location = document.getElementById('location').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const fromTime = document.getElementById('fromTime').value;
    const toTime = document.getElementById('toTime').value;

    // Basic validation
    if (!gameId || !location || !bookingDate || !fromTime || !toTime) {
        alert('Please fill in all fields');
        return;
    }

    // Time validation
    const startTime = new Date(`${bookingDate} ${fromTime}`);
    const endTime = new Date(`${bookingDate} ${toTime}`);
    
    // Calculate duration in minutes
    const durationInMinutes = (endTime - startTime) / (1000 * 60);

    if (durationInMinutes <= 0) {
        alert('End time must be after start time');
        return;
    }

    if (durationInMinutes < 30) {
        alert('Minimum booking duration is 30 minutes');
        return;
    }

    // If validation passes, show the popup
    seatPopup.style.display = 'flex';
});

// Seat Selection Popup Functionality
const seatPopup = document.getElementById('seatPopup');
const submitBtn = document.querySelector('.submit-btn');
const closePopup = document.querySelector('.close-popup');
const cancelBtn = document.querySelector('.cancel-btn');
const numberBtns = document.querySelectorAll('.number-btn');
const confirmBtn = document.querySelector('.confirm-btn');

// Show popup when clicking Book Now
submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // First validate the form
    const gameId = document.getElementById('gameId').value;
    const location = document.getElementById('location').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const fromTime = document.getElementById('fromTime').value;
    const toTime = document.getElementById('toTime').value;

    if (!gameId || !location || !bookingDate || !fromTime || !toTime) {
        alert('Please fill in all fields');
        return;
    }

    // Time validation
    const startTime = new Date(`${bookingDate} ${fromTime}`);
    const endTime = new Date(`${bookingDate} ${toTime}`);
    
    // Calculate duration in minutes
    const durationInMinutes = (endTime - startTime) / (1000 * 60);

    if (durationInMinutes <= 0) {
        alert('End time must be after start time');
        return;
    }

    if (durationInMinutes < 30) {
        alert('Minimum booking duration is 30 minutes');
        return;
    }

    // If validation passes, show the popup
    seatPopup.style.display = 'flex';
});

// Close popup functions
function closePopupFunction() {
    seatPopup.style.display = 'none';
}

closePopup.addEventListener('click', closePopupFunction);
cancelBtn.addEventListener('click', closePopupFunction);

// Close when clicking outside
seatPopup.addEventListener('click', function(e) {
    if (e.target === this) {
        closePopupFunction();
    }
});

// Number selection
numberBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        numberBtns.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Add these variables at the top with other constants
const seatMapPopup = document.getElementById('seatMapPopup');
const seats = document.querySelectorAll('.seat:not(.occupied)');
const selectedSeatsText = document.getElementById('selectedSeatsText');
const totalAmount = document.getElementById('totalAmount');
const confirmSeatsBtn = document.querySelector('.confirm-seats-btn');
const backBtn = document.querySelector('.back-btn');
let selectedSeatsCount = 0;
let pricePerSeat = 0;

// Seat selection handling
seats.forEach(seat => {
    seat.addEventListener('click', function() {
        if (!this.classList.contains('occupied')) {
            const currentSelected = document.querySelectorAll('.seat.selected').length;
            
            if (this.classList.contains('selected')) {
                // Allow deselecting a seat
                this.classList.remove('selected');
                updateSelectedSeats();
            } else if (currentSelected < selectedSeatsCount) {
                // Allow selecting a new seat if under the limit
                this.classList.add('selected');
                updateSelectedSeats();
            } else {
                alert(`You can only select ${selectedSeatsCount} seat(s). Please deselect a seat first.`);
            }
        }
    });
});

// Update the updateSelectedSeats function for better feedback
function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatNumbers = Array.from(selectedSeats).map(seat => seat.dataset.seat);
    const remaining = selectedSeatsCount - selectedSeats.length;
    
    selectedSeatsText.textContent = seatNumbers.length ? seatNumbers.join(', ') : 'None';
    const totalPrice = seatNumbers.length * pricePerSeat;
    totalAmount.textContent = totalPrice.toFixed(2);
    
    // Show selection progress
    if (remaining > 0) {
        console.log(`Please select ${remaining} more seat(s)`);
    } else if (remaining === 0) {
        console.log('All seats selected!');
    }
}

// Update the confirm selection handler to properly set selectedSeatsCount
confirmBtn.addEventListener('click', function() {
    const selectedNumber = document.querySelector('.number-btn.selected');
    if (!selectedNumber) {
        alert('Please select number of stations');
        return;
    }
    
    // Reset any previous seat selections
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    
    selectedSeatsCount = parseInt(selectedNumber.dataset.value);
    console.log(`Number of seats to select: ${selectedSeatsCount}`);
    
    // Get the selected station type and its price
    const selectedStation = document.querySelector('.station-type.selected') || document.querySelector('.station-type');
    if (selectedStation) {
        const priceText = selectedStation.querySelector('.price').textContent;
        pricePerSeat = parseInt(priceText.replace('₹', '').replace('/hr', ''));
    }
    
    // Reset the selected seats display
    updateSelectedSeats();
    
    // Close station selection popup and open seat map
    closePopupFunction();
    seatMapPopup.style.display = 'flex';
});

// Back button handler
backBtn.addEventListener('click', function() {
    seatMapPopup.style.display = 'none';
    seatPopup.style.display = 'flex';
    // Reset seat selections
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    updateSelectedSeats();
});

// Add these variables at the top
const billingDialog = document.getElementById('billingDialog');
const closeBillBtn = document.querySelector('.close-bill-btn');

// Update the confirm seats handler
confirmSeatsBtn.addEventListener('click', function() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const currentSelected = selectedSeats.length;
    
    if (currentSelected < selectedSeatsCount) {
        alert(`Please select ${selectedSeatsCount - currentSelected} more seat(s)`);
        return;
    } else if (currentSelected > selectedSeatsCount) {
        alert(`Please deselect ${currentSelected - selectedSeatsCount} seat(s)`);
        return;
    }
    
    // Generate booking ID
    const bookingId = 'GH' + Date.now().toString().slice(-6);
    
    // Get all booking details
    const gameId = document.getElementById('gameId').value;
    const location = document.getElementById('location').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const fromTime = document.getElementById('fromTime').value;
    const toTime = document.getElementById('toTime').value;
    
    // Calculate duration
    const startTime = new Date(`${bookingDate} ${fromTime}`);
    const endTime = new Date(`${bookingDate} ${toTime}`);
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    
    // Update billing dialog with selected station type
    const selectedStation = document.querySelector('.station-type.selected');
    document.getElementById('bookingId').textContent = bookingId;
    document.getElementById('billDate').textContent = new Date(bookingDate).toLocaleDateString();
    document.getElementById('billTimeSlot').textContent = `${fromTime} - ${toTime}`;
    document.getElementById('billLocation').textContent = location;
    document.getElementById('billStationType').textContent = selectedStation ? selectedStation.querySelector('h3').textContent : 'HIGH PERFORMANCE';
    document.getElementById('billSelectedSeats').textContent = Array.from(selectedSeats).map(seat => seat.dataset.seat).join(', ');
    document.getElementById('billDuration').textContent = `${durationHours.toFixed(1)} hours`;
    document.getElementById('billTotalAmount').textContent = `₹${(parseFloat(totalAmount.textContent) * durationHours).toFixed(2)}`;
    
    // Hide seat map and show billing dialog
    seatMapPopup.style.display = 'none';
    billingDialog.style.display = 'flex';
    
    // Simulate sending notifications
    setTimeout(() => {
        console.log('Email sent with booking details');
        console.log('WhatsApp message sent with booking confirmation');
    }, 1000);
});

// Close billing dialog
closeBillBtn.addEventListener('click', function() {
    billingDialog.style.display = 'none';
    // Reset form
    document.querySelector('form').reset();
});

// Download invoice
document.querySelector('.download-btn').addEventListener('click', function() {
    // Implement PDF generation and download here
    alert('Invoice downloaded successfully!');
});

// Payment method selection
document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert(`Redirecting to ${this.textContent} payment gateway...`);
    });
});

// Add station type selection
document.querySelectorAll('.station-type').forEach(station => {
    station.addEventListener('click', function() {
        // Remove selected class from all station types
        document.querySelectorAll('.station-type').forEach(s => s.classList.remove('selected'));
        // Add selected class to clicked station
        this.classList.add('selected');
    });
}); 