import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingCart, MapPin, Clock, Star, Search, X } from 'lucide-react';
import { doorDashService, DoorDashStore, DoorDashItem } from '@/services/doordash';

interface DoorDashOrderProps {
  itemName: string;
  itemCategory: string;
  onOrderComplete?: (orderId: string) => void;
}

const DoorDashOrder: React.FC<DoorDashOrderProps> = ({ itemName, itemCategory, onOrderComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState<DoorDashStore[]>([]);
  const [selectedStore, setSelectedStore] = useState<DoorDashStore | null>(null);
  const [storeItems, setStoreItems] = useState<DoorDashItem[]>([]);
  const [cart, setCart] = useState<Array<{ item: DoorDashItem; quantity: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(itemName);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (isOpen && !userLocation) {
      loadUserLocation();
    }
  }, [isOpen]);

  const loadUserLocation = async () => {
    try {
      const location = await doorDashService.getCurrentLocation();
      setUserLocation(location);
      await searchStores();
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Unable to load stores. Please try again.');
    }
  };

  const searchStores = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const foundStores = await doorDashService.searchStores(
        searchQuery,
        userLocation.latitude,
        userLocation.longitude
      );
      setStores(foundStores);
    } catch (error) {
      setError('Failed to search stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectStore = async (store: DoorDashStore) => {
    setSelectedStore(store);
    setLoading(true);
    
    try {
      const items = await doorDashService.getStoreItems(store.id);
      setStoreItems(items);
    } catch (error) {
      setError('Failed to load store items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: DoorDashItem) => {
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.item.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!selectedStore || cart.length === 0) return;
    
    setLoading(true);
    try {
      const order = {
        store_id: selectedStore.id,
        items: cart.map(cartItem => ({
          item_id: cartItem.item.id,
          quantity: cartItem.quantity,
        })),
        delivery_address: {
          street: '4001 E Stevens Way NE', // University of Washington Husky Union Building
          city: 'Seattle',
          state: 'WA',
          zip_code: '98195',
        },
      };

      const result = await doorDashService.createOrder(order);
      
      // Open DoorDash checkout in new window
      window.open(result.checkout_url, '_blank');
      
      if (onOrderComplete) {
        onOrderComplete(result.order_id);
      }
      
      setIsOpen(false);
    } catch (error) {
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white text-xs">
          <ShoppingCart className="w-3 h-3 mr-1" />
          DoorDash
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#FF6B6B]" />
            Order {itemName} via DoorDash
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Search for stores</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for stores..."
              />
            </div>
            <Button onClick={searchStores} disabled={loading} className="mt-6">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B] mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          )}

          {/* Store Selection */}
          {!selectedStore && stores.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Stores</h3>
              <div className="grid gap-3">
                {stores.map((store) => (
                  <Card 
                    key={store.id} 
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => selectStore(store)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{store.name}</h4>
                          <p className="text-sm text-muted-foreground">{store.address}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{store.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{store.estimated_delivery_time} min</span>
                            </div>
                            <Badge variant="secondary">${store.delivery_fee} delivery</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Store Items */}
          {selectedStore && storeItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedStore.name} Menu</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedStore(null)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Back to Stores
                </Button>
              </div>
              
              <div className="grid gap-3">
                {storeItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <Badge variant="outline" className="mt-1">{item.category}</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">${item.price.toFixed(2)}</span>
                          <Button 
                            size="sm" 
                            onClick={() => addToCart(item)}
                            className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Shopping Cart */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.map((cartItem) => (
                    <div key={cartItem.item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{cartItem.item.name}</h4>
                        <p className="text-sm text-muted-foreground">${cartItem.item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{cartItem.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(cartItem.item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total: ${getTotalPrice().toFixed(2)}</span>
                      <Button 
                        onClick={handleCheckout}
                        disabled={loading}
                        className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                      >
                        {loading ? 'Processing...' : 'Checkout on DoorDash'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoorDashOrder;
