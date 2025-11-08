// Trip data mapping
const tripData = {
  'annapurna-base-camp': {
    name: 'Annapurna Base Camp - 7 Days',
    duration: '7 Days',
    basePrice: 999
  },
  'gokyo-valley-trek': {
    name: 'Gokyo Valley Trek - 15 Days',
    duration: '15 Days',
    basePrice: 1599
  },
  'everest-base-camp': {
    name: 'Everest Base Camp - 14 Days',
    duration: '14 Days',
    basePrice: 1599
  },
  'langtang-valley-trek': {
    name: 'Langtang Valley Trek - 8 Days',
    duration: '8 Days',
    basePrice: 599
  },
  'tilicho-lake-trek': {
    name: 'Tilicho Lake Trek - 15 Days',
    duration: '15 Days',
    basePrice: 1599
  },
  'helicopter-trek-ebc': {
    name: 'Helicopter Trek to EBC - 2 Days',
    duration: '2 Days',
    basePrice: 2599
  }
};

// Get trip ID from URL parameters
function getTripIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('trip') || 'annapurna-base-camp';
}

// Initialize booking page
function initBookingPage() {
  const tripId = getTripIdFromURL();
  const trip = tripData[tripId];

  if (!trip) {
    // Redirect to home if invalid trip
    window.location.href = 'index.html';
    return;
  }

  // Update trip information
  document.getElementById('trip-name').textContent = trip.name;
  document.getElementById('trip-duration').textContent = trip.duration;
  document.getElementById('base-price').textContent = `$${trip.basePrice}`;
  
  // Store base price in a data attribute on the form for easy access
  document.getElementById('booking-form').setAttribute('data-base-price', trip.basePrice);
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('departure-date').setAttribute('min', today);
  
  // Calculate initial price
  calculatePrice();
}

// Calculate total price based on number of travelers
// Formula: Total Cost = Base Price × (1 + 0.98 × (Travelers - 1))
// This means: 1 traveler = base price, each additional traveler adds 98% of base price
function calculatePrice() {
  const basePrice = parseFloat(document.getElementById('booking-form').getAttribute('data-base-price')) || 0;
  const travelers = parseInt(document.getElementById('travelers').value) || 1;
  
  // Calculate total: base price for first traveler, then add 98% of base for each additional traveler
  // Formula: basePrice × (1 + 0.98 × (travelers - 1))
  const totalCost = basePrice * (1 + 0.98 * (travelers - 1));
  
  // Update display
  document.getElementById('display-base-price').textContent = `$${basePrice.toFixed(2)}`;
  document.getElementById('display-travelers').textContent = travelers;
  document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const formData = {
    tripName: document.getElementById('trip-name').textContent,
    departureDate: document.getElementById('departure-date').value,
    travelers: document.getElementById('travelers').value,
    fullName: document.getElementById('full-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    specialRequests: document.getElementById('special-requests').value,
    totalCost: document.getElementById('total-cost').textContent
  };
  
  // Here you would typically send the data to a server
  // For now, we'll show an alert and could redirect to a confirmation page
  console.log('Booking Data:', formData);
  
  // Show confirmation message
  alert(`Thank you ${formData.fullName}!\n\nYour booking for ${formData.tripName} has been submitted.\n\nDeparture Date: ${formData.departureDate}\nTravelers: ${formData.travelers}\nTotal Cost: ${formData.totalCost}\n\nWe will contact you shortly at ${formData.email} to confirm your booking.`);
  
  // Optionally redirect to home page
  // window.location.href = 'index.html';
  
  // Or reset the form
  // document.getElementById('booking-form').reset();
  // calculatePrice();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initBookingPage();
  
  // Add event listener for travelers input
  document.getElementById('travelers').addEventListener('input', calculatePrice);
});

