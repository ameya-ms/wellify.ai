// Lyft service using deep links (no API keys required)
export interface LyftRideRequest {
  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  rideType?: string;
}

export interface LyftRideEstimate {
  rideType: string;
  estimatedTime: string;
  estimatedCost: string;
  currency: string;
}

export interface LyftBookingResult {
  success: boolean;
  deepLink?: string;
  webLink?: string;
  error?: string;
}

class LyftService {
  // Get ride estimates (mock data since no API access)
  async getRideEstimates(request: LyftRideRequest): Promise<LyftRideEstimate[]> {
    try {
      // Mock data for demo - in production, you'd use real API calls
      const estimates: LyftRideEstimate[] = [
        {
          rideType: 'Lyft',
          estimatedTime: '4-7 min',
          estimatedCost: '$7-11',
          currency: 'USD'
        },
        {
          rideType: 'Lyft XL',
          estimatedTime: '6-9 min',
          estimatedCost: '$12-18',
          currency: 'USD'
        },
        {
          rideType: 'Lyft Lux',
          estimatedTime: '8-12 min',
          estimatedCost: '$18-25',
          currency: 'USD'
        }
      ];

      return estimates;
    } catch (error) {
      console.error('Error getting Lyft estimates:', error);
      return [];
    }
  }

  // Book a ride with Lyft using deep links
  async bookLyftRide(request: LyftRideRequest): Promise<LyftBookingResult> {
    try {
      // Create deep link for Lyft app
      const pickupLat = request.pickup.latitude.toFixed(6);
      const pickupLng = request.pickup.longitude.toFixed(6);
      const destLat = request.destination.latitude.toFixed(6);
      const destLng = request.destination.longitude.toFixed(6);
      const destName = encodeURIComponent(request.destination.address || 'Destination');
      
      // Lyft deep link format
      const deepLink = `lyft://ridetype?id=lyft&pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&destination[latitude]=${destLat}&destination[longitude]=${destLng}`;
      
      // Fallback web link
      const webLink = `https://www.lyft.com/rider?pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&destination[latitude]=${destLat}&destination[longitude]=${destLng}`;
      
      console.log('Lyft deep link created:', deepLink);
      console.log('Lyft web link created:', webLink);
      
      return {
        success: true,
        deepLink,
        webLink
      };
    } catch (error) {
      console.error('Error creating Lyft deep link:', error);
      return {
        success: false,
        error: 'Failed to book Lyft ride'
      };
    }
  }

  // Get current user location (hardcoded to UW)
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    // Hardcoded to University of Washington Husky Union Building
    return Promise.resolve({
      latitude: 47.6553,
      longitude: -122.3035
    });
  }
}

export const lyftService = new LyftService();
