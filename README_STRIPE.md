# Stripe Payment Integration Setup Guide

This guide will help you set up the Stripe payment integration for the Trek Buddy booking system.

## Prerequisites

- Node.js (v14 or higher) installed on your system
- Stripe account with API keys (provided)
- Basic knowledge of command line

## Installation Steps

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install the required packages:
- `express` - Web server framework
- `stripe` - Stripe SDK
- `cors` - CORS middleware

### 2. Update API Base URL

In `booking.js`, update the `API_BASE_URL` variable:

**For local development:**
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

**For production (after deploying your server):**
```javascript
const API_BASE_URL = 'https://your-server-url.com';
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Test the Integration

1. Open your browser and navigate to `http://localhost:3000`
2. Click on any "BOOK NOW" button
3. Fill in the booking form
4. Click "Proceed to Payment"
5. You will be redirected to Stripe Checkout

## Stripe Test Cards

Use these test card numbers to test payments:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

## Deployment Options

### Option 1: Deploy to Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Run:
```bash
heroku create your-app-name
git push heroku main
heroku open
```

### Option 2: Deploy to Railway

1. Create a Railway account
2. Connect your GitHub repository
3. Railway will automatically deploy your app

### Option 3: Deploy to Render

1. Create a Render account
2. Create a new Web Service
3. Connect your repository
4. Set the start command: `npm start`

### Option 4: Deploy to Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Create `api/create-checkout-session.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Your checkout session code here
};
```

## Environment Variables (Recommended)

For better security, use environment variables for your Stripe keys:

1. Create a `.env` file:
```
STRIPE_SECRET_KEY=sk_test_51SRNSDIph1qmQeBAnIYib62qb3RUHY93PsqnmvtLGnoLW9vAfg89LVE9ZyJrATT8BKFPmJeEnZjbrFgU59mMt30l00OURgJnSV
PORT=3000
```

2. Install `dotenv`:
```bash
npm install dotenv
```

3. Update `server.js`:
```javascript
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

## Important Notes

1. **Never expose your secret key** in client-side code (it's safe in `server.js` as it runs on the server)
2. **Update the API_BASE_URL** in `booking.js` when deploying to production
3. **Set up webhooks** in your Stripe dashboard for production to handle payment confirmations
4. **Test thoroughly** using Stripe test cards before going live
5. **Switch to live keys** when ready for production (replace `pk_test_` with `pk_live_` and `sk_test_` with `sk_live_`)

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure the `cors` middleware is properly configured in `server.js`.

### Connection Refused
- Make sure the server is running
- Check that the port (3000) is not already in use
- Verify the API_BASE_URL in `booking.js` matches your server URL

### Payment Not Processing
- Check browser console for errors
- Verify Stripe keys are correct
- Check server logs for errors
- Ensure you're using test cards in test mode

## Support

For Stripe-related issues, check:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Testing](https://stripe.com/docs/testing)

For application issues, check the server logs and browser console.

