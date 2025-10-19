// DoorDash API Service
const DOORDASH_CONFIG = {
  developerId: import.meta.env.VITE_DOORDASH_DEVELOPER_ID || 'e5762890-d22f-4644-a5c7-ca92b6d911ff',
  keyId: import.meta.env.VITE_DOORDASH_KEY_ID || '11af88ea-5d64-4fb0-bfe9-3311a244f8c9',
  signingSecret: import.meta.env.VITE_DOORDASH_SIGNING_SECRET || 'eRSOTC36dznITl4awLz_mi9BdsdMX8PASjmb40Eqxt4',
  baseUrl: 'https://openapi.doordash.com',
};

interface DoorDashStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  delivery_fee: number;
  estimated_delivery_time: number;
}

interface DoorDashItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
}

interface DoorDashOrder {
  store_id: string;
  items: Array<{
    item_id: string;
    quantity: number;
  }>;
  delivery_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

class DoorDashService {
  private generateSignature(method: string, path: string, body: string = ''): string {
    // This is a simplified signature generation
    // In production, you'd need to implement proper HMAC-SHA256 signing
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${method.toUpperCase()} ${path} ${timestamp}${body}`;
    return btoa(message + DOORDASH_CONFIG.signingSecret);
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature(method, endpoint, body ? JSON.stringify(body) : '');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${signature}`,
      'X-DoorDash-Developer-Id': DOORDASH_CONFIG.developerId,
      'X-DoorDash-Key-Id': DOORDASH_CONFIG.keyId,
      'X-DoorDash-Timestamp': timestamp.toString(),
    };

    const response = await fetch(`${DOORDASH_CONFIG.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`DoorDash API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchStores(query: string, latitude: number, longitude: number): Promise<DoorDashStore[]> {
    try {
      // Mock data for demonstration - in production this would be a real API call
      const mockStores: DoorDashStore[] = [
        {
          id: 'store-1',
          name: 'Panda Express',
          address: '4500 University Way NE, Seattle, WA 98105',
          phone: '(206) 632-1234',
          rating: 4.2,
          delivery_fee: 2.99,
          estimated_delivery_time: 25,
        },
        {
          id: 'store-2',
          name: 'Subway',
          address: '4200 University Way NE, Seattle, WA 98105',
          phone: '(206) 632-5678',
          rating: 4.0,
          delivery_fee: 1.99,
          estimated_delivery_time: 20,
        },
        {
          id: 'store-3',
          name: 'Chipotle Mexican Grill',
          address: '4300 University Way NE, Seattle, WA 98105',
          phone: '(206) 632-9012',
          rating: 4.5,
          delivery_fee: 3.49,
          estimated_delivery_time: 30,
        },
        {
          id: 'store-4',
          name: 'Starbucks',
          address: '4100 University Way NE, Seattle, WA 98105',
          phone: '(206) 632-3456',
          rating: 4.3,
          delivery_fee: 1.99,
          estimated_delivery_time: 15,
        },
      ];

      // Filter stores based on query
      const filteredStores = mockStores.filter(store => 
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes('soup') ||
        query.toLowerCase().includes('chicken')
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return filteredStores;
    } catch (error) {
      console.error('Error searching DoorDash stores:', error);
      return [];
    }
  }

  async getStoreItems(storeId: string): Promise<DoorDashItem[]> {
    try {
      // Mock data for demonstration - in production this would be a real API call
      const mockItems: DoorDashItem[] = [
        {
          id: 'item-1',
          name: 'Chicken Noodle Soup',
          description: 'Classic comfort soup with tender chicken, noodles, and vegetables',
          price: 8.99,
          image_url: '/chicken-soup.jpg',
          category: 'Soup',
        },
        {
          id: 'item-2',
          name: 'Wonton Soup',
          description: 'Traditional Chinese soup with pork wontons and vegetables',
          price: 7.99,
          image_url: '/wonton-soup.jpg',
          category: 'Soup',
        },
        {
          id: 'item-3',
          name: 'Hot and Sour Soup',
          description: 'Spicy and tangy soup with tofu, mushrooms, and bamboo shoots',
          price: 6.99,
          image_url: '/hot-sour-soup.jpg',
          category: 'Soup',
        },
        {
          id: 'item-4',
          name: 'Orange Chicken',
          description: 'Crispy chicken in tangy orange sauce',
          price: 12.99,
          image_url: '/orange-chicken.jpg',
          category: 'Entree',
        },
        {
          id: 'item-5',
          name: 'Fried Rice',
          description: 'Classic fried rice with eggs, vegetables, and your choice of protein',
          price: 9.99,
          image_url: '/fried-rice.jpg',
          category: 'Rice',
        },
        {
          id: 'item-6',
          name: 'Spring Rolls',
          description: 'Crispy vegetable spring rolls with sweet and sour sauce',
          price: 5.99,
          image_url: '/spring-rolls.jpg',
          category: 'Appetizer',
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockItems;
    } catch (error) {
      console.error('Error fetching DoorDash store items:', error);
      return [];
    }
  }

  async createOrder(order: DoorDashOrder): Promise<{ order_id: string; checkout_url: string }> {
    try {
      // Mock order creation - in production this would be a real API call
      const orderId = `order-${Date.now()}`;
      const checkoutUrl = `https://www.doordash.com/checkout/${orderId}`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        order_id: orderId,
        checkout_url: checkoutUrl,
      };
    } catch (error) {
      console.error('Error creating DoorDash order:', error);
      throw error;
    }
  }

  // Get hardcoded location for University of Washington Husky Union Building
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    // University of Washington Husky Union Building coordinates
    return Promise.resolve({
      latitude: 47.6553,
      longitude: -122.3035,
    });
  }
}

export const doorDashService = new DoorDashService();
export type { DoorDashStore, DoorDashItem, DoorDashOrder };
