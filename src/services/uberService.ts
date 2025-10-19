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
  rideType?: string;
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

  // Get access token for Uber API
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch('https://login.uber.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
          scope: 'request'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Uber access token:', error);
      throw error;
    }
  }

  // Get ride estimates from Uber API
  async getRideEstimates(request: UberRideRequest): Promise<UberRideEstimate[]> {
    try {
      // First get available products
      const products = await this.getProducts(request.pickup);
      if (products.length === 0) {
        return this.getMockEstimates();
      }

      // Get price estimates for each product
      const estimates: UberRideEstimate[] = [];
      
      for (const product of products.slice(0, 3)) { // Limit to 3 products
        try {
          const priceEstimate = await this.getPriceEstimate(request, product.product_id);
          const timeEstimate = await this.getTimeEstimate(request.pickup, product.product_id);
          
          estimates.push({
            rideType: product.display_name,
            estimatedTime: `${timeEstimate} min`,
            estimatedCost: priceEstimate ? `$${priceEstimate.low_estimate}-${priceEstimate.high_estimate}` : 'N/A',
            currency: 'USD',
            productId: product.product_id
          });
        } catch (error) {
          console.warn(`Failed to get estimate for ${product.display_name}:`, error);
        }
      }

      // Fallback to mock data if no real estimates
      return estimates.length > 0 ? estimates : this.getMockEstimates();
    } catch (error) {
      console.error('Error getting Uber estimates:', error);
      return this.getMockEstimates();
    }
  }

  // Get available products at pickup location
  private async getProducts(pickup: { latitude: number; longitude: number }): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://api.uber.com/v1.2/products?latitude=${pickup.latitude}&longitude=${pickup.longitude}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get products');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error getting Uber products:', error);
      return [];
    }
  }

  // Get price estimate for a specific product
  private async getPriceEstimate(request: UberRideRequest, productId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://api.uber.com/v1.2/estimates/price?start_latitude=${request.pickup.latitude}&start_longitude=${request.pickup.longitude}&end_latitude=${request.destination.latitude}&end_longitude=${request.destination.longitude}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get price estimate');
      }

      const data = await response.json();
      return data.prices?.find((price: any) => price.product_id === productId);
    } catch (error) {
      console.error('Error getting price estimate:', error);
      return null;
    }
  }

  // Get time estimate for a specific product
  private async getTimeEstimate(pickup: { latitude: number; longitude: number }, productId: string): Promise<number> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://api.uber.com/v1.2/estimates/time?start_latitude=${pickup.latitude}&start_longitude=${pickup.longitude}&product_id=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get time estimate');
      }

      const data = await response.json();
      const timeEstimate = data.times?.find((time: any) => time.product_id === productId);
      return timeEstimate?.estimate || 5; // Default to 5 minutes
    } catch (error) {
      console.error('Error getting time estimate:', error);
      return 5; // Default fallback
    }
  }

  // Mock estimates as fallback
  private getMockEstimates(): UberRideEstimate[] {
    return [
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
