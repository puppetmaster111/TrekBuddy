const express = require('express');
require('dotenv').config();
const stripe= require('stripe')(process.env.KEY);
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.KEY) {
  console.error('ERROR: KEY is not set in .env file');
  console.error('Please create a .env file with your Stripe secret key');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const {
      amount,
      tripName,
      departureDate,
      travelers,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      totalCost,
      payableArrival,
      tripId
    } = req.body;

    // Get origin from request headers for dynamic URL generation
    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tripName} - Deposit Payment`,
              description: `Booking for ${travelers} traveler(s). Departure: ${departureDate}. ${specialRequests ? `Special Requests: ${specialRequests}` : ''}`,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}&trip=${encodeURIComponent(tripName)}`,
      cancel_url: `${origin}/booking.html${tripId ? '?trip=' + tripId : ''}`,
      customer_email: customerEmail,
      metadata: {
        tripName: tripName,
        departureDate: departureDate,
        travelers: travelers.toString(),
        customerName: customerName,
        customerPhone: customerPhone,
        specialRequests: specialRequests || '',
        totalCost: totalCost.toString(),
        payableArrival: payableArrival.toString(),
        paymentType: 'deposit'
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe (optional - for handling payment confirmations)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment successful for session:', session.id);
    // Here you can save booking details to database, send confirmation email, etc.
  }

  res.json({ received: true });
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/booking.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'booking.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Make sure to update API_BASE_URL in booking.js to point to this server`);
});

