// Uber API service for ride booking integration
export interface UberRideRequest {
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

export interface UberRideEstimate {
  rideType: string;
  estimatedTime: string;
  estimatedCost: string;
  currency: string;
  productId: string;
}

export interface UberBookingResult {
  success: boolean;
  rideId?: string;
  deepLink?: string;
  error?: string;
}

class UberService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string = 'https://api.uber.com/v1.2';

  constructor() {
    this.clientId = import.meta.env.VITE_UBER_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_UBER_CLIENT_SECRET || 'yCGOjRH8b7f1Go6WC913qaAVERmoLXjza55jH4sm';
  }

  // Get ride estimates from Uber
  async getRideEstimates(request: UberRideRequest): Promise<UberRideEstimate[]> {
    try {
      // For demo purposes, return mock data
      // In production, you'd make actual API calls to Uber
      const estimates: UberRideEstimate[] = [
        {
          rideType: 'UberX',
          estimatedTime: '5-8 min',
          estimatedCost: '$8-12',
          currency: 'USD',
          productId: 'uberx'
        },
        {
          rideType: 'Uber Comfort',
          estimatedTime: '6-10 min',
          estimatedCost: '$12-16',
          currency: 'USD',
          productId: 'comfort'
        },
        {
          rideType: 'Uber Pool',
          estimatedTime: '7-12 min',
          estimatedCost: '$6-9',
          currency: 'USD',
          productId: 'pool'
        }
      ];

      return estimates;
    } catch (error) {
      console.error('Error getting Uber estimates:', error);
      return [];
    }
  }

  // Book a ride with Uber
  async bookUberRide(request: UberRideRequest): Promise<UberBookingResult> {
    try {
      // Create deep link for Uber app with proper formatting
      const pickupLat = request.pickup.latitude.toFixed(6);
      const pickupLng = request.pickup.longitude.toFixed(6);
      const destLat = request.destination.latitude.toFixed(6);
      const destLng = request.destination.longitude.toFixed(6);
      const destName = encodeURIComponent(request.destination.address || 'Destination');
      
      // Try multiple deep link formats
      const deepLink = `uber://?action=setPickup&pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&pickup[nickname]=UW%20Husky%20Union&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${destName}`;
      
      console.log('Uber deep link created:', deepLink);
      
      return {
        success: true,
        deepLink,
        rideId: `uber_${Date.now()}`
      };
    } catch (error) {
      console.error('Error creating Uber deep link:', error);
      return {
        success: false,
        error: 'Failed to book Uber ride'
      };
    }
  }

  // Get current user location (hardcoded to UW Husky Union Building)
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    // Hardcoded to University of Washington Husky Union Building
    return Promise.resolve({
      latitude: 47.6553,
      longitude: -122.3035
    });
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    try {
      // Using a geocoding service
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      }
      
      throw new Error('Address not found');
    } catch (error) {
      throw new Error('Failed to geocode address');
    }
  }

  // Get time estimates
  async getTimeEstimates(request: UberRideRequest): Promise<any[]> {
    try {
      // Mock time estimates
      return [
        {
          productId: 'uberx',
          estimatedTime: 5
        },
        {
          productId: 'comfort',
          estimatedTime: 6
        }
      ];
    } catch (error) {
      console.error('Error getting time estimates:', error);
      return [];
    }
  }
}

export const uberService = new UberService();
