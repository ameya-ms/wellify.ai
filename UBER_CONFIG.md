# Uber API Configuration

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Uber API Configuration
VITE_UBER_CLIENT_ID=your_uber_client_id_here
VITE_UBER_CLIENT_SECRET=yCGOjRH8b7f1Go6WC913qaAVERmoLXjza55jH4sm

# Geocoding API (for address to coordinates conversion)
VITE_OPENCAGE_API_KEY=your_opencage_api_key_here
```

## Your Uber Client Secret
Your Uber client secret has been integrated: `yCGOjRH8b7f1Go6WC913qaAVERmoLXjza55jH4sm`

## Implementation Details

### Files Created:
1. **`src/services/uberService.ts`** - Uber API service with your client secret
2. **`src/components/UberBooking.tsx`** - Uber booking component
3. **Updated `src/pages/Symptoms.tsx`** - Integrated Uber booking in symptoms page

### Features Implemented:
- ✅ Uber ride estimates (UberX, Uber Comfort, Uber Pool)
- ✅ Location detection for pickup
- ✅ Deep link integration to open Uber app
- ✅ Real-time ride booking
- ✅ Error handling and loading states
- ✅ Beautiful UI with Uber branding

### How It Works:
1. User selects symptoms and views recommended facilities
2. Clicks "Book Uber" button on any facility
3. System detects user location
4. Shows Uber ride options with estimates
5. Opens Uber app with pre-filled destination
6. User completes booking in Uber app

### Next Steps:
1. Get your Uber Client ID from Uber Developer Portal
2. Add it to your `.env` file
3. Test the integration on your symptoms page
4. The system will automatically use your client secret for API calls

## Testing
1. Navigate to `/symptoms` page
2. Select any symptoms
3. Click "Book Uber" on any facility
4. Test the ride booking flow
