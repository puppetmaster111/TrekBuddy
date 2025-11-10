// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SRNSDIph1qmQeBANLXEdKH0msZINJNErqxvfAmjwNK5ELgxtHwzDVmpc7iwAjY51E9xaQKaFO56Gk16jBQCtQrI00mLwEZneU';
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Backend API endpoint - Update this to your server URL
const API_BASE_URL = 'https://trekbuddy.onrender.com'; // Update this with your deployed server URL

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
  
  // Calculate payment breakdown: 25% payable now, 75% on arrival
  const payableNow = totalCost * 0.25;
  const payableArrival = totalCost * 0.75;
  
  // Update display
  document.getElementById('display-base-price').textContent = `$${basePrice.toFixed(2)}`;
  document.getElementById('display-travelers').textContent = travelers;
  document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
  document.getElementById('payable-now').textContent = `$${payableNow.toFixed(2)}`;
  document.getElementById('payable-arrival').textContent = `$${payableArrival.toFixed(2)}`;
}

// Handle form submission and create Stripe checkout session
async function handleSubmit(event) {
  event.preventDefault();
  
  // Disable submit button to prevent multiple clicks
  const submitBtn = event.target.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  
  try {
    // Get form data
    const formData = {
      tripName: document.getElementById('trip-name').textContent,
      departureDate: document.getElementById('departure-date').value,
      travelers: parseInt(document.getElementById('travelers').value),
      fullName: document.getElementById('full-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      specialRequests: document.getElementById('special-requests').value,
      totalCost: parseFloat(document.getElementById('total-cost').textContent.replace('$', '')),
      payableNow: parseFloat(document.getElementById('payable-now').textContent.replace('$', '')),
      payableArrival: parseFloat(document.getElementById('payable-arrival').textContent.replace('$', ''))
    };
    
    // Get trip ID from URL for cancel redirect
    const tripId = getTripIdFromURL();
    
    // Create checkout session via backend
    const response = await fetch(`https://trekbuddy.onrender.com/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(formData.payableNow * 100), // Convert to cents
        tripName: formData.tripName,
        departureDate: formData.departureDate,
        travelers: formData.travelers,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        specialRequests: formData.specialRequests,
        totalCost: formData.totalCost,
        payableArrival: formData.payableArrival,
        tripId: tripId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    const session = await response.json();
    
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error processing your payment. Please try again.\n\nError: ' + error.message);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initBookingPage();
  
  // Add event listener for travelers input
  document.getElementById('travelers').addEventListener('input', calculatePrice);
});

