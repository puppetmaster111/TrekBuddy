# Quick Start Guide - Stripe Payment Integration

## Step 1: Install Dependencies

Open terminal in your project folder and run:

```bash
npm install
```

## Step 2: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## Step 3: Test the Payment Flow

1. Open your browser and go to `http://localhost:3000`
2. Click on any "BOOK NOW" button
3. Fill in the booking form
4. Click "Proceed to Payment"
5. You'll be redirected to Stripe Checkout

## Test Cards

Use these Stripe test cards:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`

Use any future expiry date (e.g., 12/25), any 3-digit CVC (e.g., 123), and any ZIP code.

## Important Notes

1. **For Production:** Update `API_BASE_URL` in `booking.js` to your deployed server URL
2. **Switch to Live Keys:** Replace test keys with live keys when going to production
3. **Never expose your secret key** in client-side code (it's safe in `server.js`)

## Troubleshooting

- **Server won't start:** Make sure Node.js is installed and port 3000 is available
- **Payment not working:** Check browser console and server logs for errors
- **CORS errors:** The server already has CORS enabled, but make sure you're accessing via the server URL

For detailed setup instructions, see `README_STRIPE.md`

