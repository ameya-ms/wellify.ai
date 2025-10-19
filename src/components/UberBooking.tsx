import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Clock, DollarSign, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { uberService, UberRideRequest, UberRideEstimate, UberBookingResult } from '@/services/uberService';

interface UberBookingProps {
  destination: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  onRideBooked?: (result: UberBookingResult) => void;
}

const UberBooking: React.FC<UberBookingProps> = ({ destination, onRideBooked }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimates, setEstimates] = useState<UberRideEstimate[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Destination-specific Uber links
  const getDestinationLink = (destinationName: string): string => {
    const name = destinationName.toLowerCase();
    
    if (name.includes('hall health') || name.includes('hall health center')) {
      return 'https://m.uber.com/go/product-selection?drop%5B0%5D=%7B%22addressLine1%22%3A%22Hall%20Health%20Center%22%2C%22addressLine2%22%3A%224060%20E%20Stevens%20Way%20NE%2C%20Seattle%2C%20WA%22%2C%22id%22%3A%2224ad0ceb-8683-5666-33f3-b94cd981a836%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A47.6561779%2C%22longitude%22%3A-122.3041524%2C%22provider%22%3A%22uber_places%22%7D&marketing_vistor_id=661855eb-219d-414d-bb28-de0fdf845221&pickup=%7B%22addressLine1%22%3A%22Husky%20Union%20Building%22%2C%22addressLine2%22%3A%224001%20e%20stevens%20way%20ne%2C%20Seattle%2C%20WA%22%2C%22id%22%3A%225fb208be-7380-bad6-0f3a-19dce7f9c981%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A47.6554554%2C%22longitude%22%3A-122.3052966%2C%22provider%22%3A%22uber_places%22%7D&uclick_id=c11b4fa7-4ac1-476e-b947-81fbc6155612';
    }
    
    if (name.includes('uwmc emergency') || name.includes('uwmc emergency room')) {
      return 'https://m.uber.com/go/product-selection?drop%5B0%5D=%7B%22addressLine1%22%3A%22UWMC%20Emergency%20Room%22%2C%22addressLine2%22%3A%221959%20NE%20Pacific%20St%2C%20Seattle%2C%20WA%22%2C%22id%22%3A%22426b32e6-d6b7-6b6e-dd82-904967a22def%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A47.649115%2C%22longitude%22%3A-122.3069936%2C%22provider%22%3A%22uber_places%22%7D&marketing_vistor_id=661855eb-219d-414d-bb28-de0fdf845221&pickup=%7B%22addressLine1%22%3A%22Husky%20Union%20Building%22%2C%22addressLine2%22%3A%224001%20e%20stevens%20way%20ne%2C%20Seattle%2C%20WA%22%2C%22id%22%3A%225fb208be-7380-bad6-0f3a-19dce7f9c981%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A47.6554554%2C%22longitude%22%3A-122.3052966%2C%22provider%22%3A%22uber_places%22%7D&uclick_id=c11b4fa7-4ac1-476e-b947-81fbc6155612&vehicle=174';
    }
    
    if (name.includes('uwmc') || name.includes('uw medical center') || name.includes('montlake')) {
      return 'https://m.uber.com/go/product-selection?drop%5B0%5D=%7B%22addressLine1%22%3A%22UW%20Medical%20Center%20-%20Montlake%22%2C%22addressLine2%22%3A%221959%20NE%20Pacific%20St%2C%20Seattle%2C%20WA%22%2C%22id%22%3A%22555fee83-f288-34fe-b584-70304a86d7f0%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A47.649205%2C%22longitude%22%3A-122.3070911%2C%22provider%22%3A%22uber_places%22%7D&marketing_vistor_id=661855eb-219d-414d-bb28-de0fdf845221&pickup=%7B%22addressLine1%22%3A%22Husky%20Union%20Building%22%2C%22addressLine2%22%3A%224001%20e%20stevens%20way%20ne%2C%20Seattle%2C%20WA%22%2C%22id%22%3A%225fb208be-7380-bad6-0f3a-19dce7f9c981%22%2C%22source%22%3A%22SEARCH%22%2C%22latitude%22%3A47.6554554%2C%22longitude%22%3A-122.3052966%2C%22provider%22%3A%22uber_places%22%7D&uclick_id=c11b4fa7-4ac1-476e-b947-81fbc6155612';
    }
    
    // Fallback to generic link
    return `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=47.6553&pickup[longitude]=-122.3035&pickup[nickname]=UW%20Husky%20Union&dropoff[latitude]=${destination.latitude}&dropoff[longitude]=${destination.longitude}&dropoff[nickname]=${encodeURIComponent(destination.name)}`;
  };

  useEffect(() => {
    if (isOpen && !userLocation) {
      loadUserLocation();
    }
  }, [isOpen]);

  const loadUserLocation = async () => {
    try {
      const location = await uberService.getCurrentLocation();
      setUserLocation(location);
      await loadEstimates(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Unable to get your location. Please try again.');
    }
  };

  const loadEstimates = async (location: { latitude: number; longitude: number }) => {
    setLoading(true);
    setError(null);

    try {
      const request: UberRideRequest = {
        pickup: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destination.address
        }
      };

      const rideEstimates = await uberService.getRideEstimates(request);
      setEstimates(rideEstimates);
    } catch (error) {
      console.error('Error loading estimates:', error);
      setError('Failed to load ride estimates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideType: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get the destination-specific link
      const uberLink = getDestinationLink(destination.name);
      console.log('Opening Uber link:', uberLink);

      // Try to open the Uber app
      try {
        // First try the deep link
        window.location.href = uberLink;
        
        // Fallback: open in new tab after a delay
        setTimeout(() => {
          window.open(uberLink, '_blank');
        }, 1000);
        
        if (onRideBooked) {
          onRideBooked({
            success: true,
            deepLink: uberLink,
            rideType: rideType
          });
        }
        
        setIsOpen(false);
      } catch (linkError) {
        console.error('Error opening Uber link:', linkError);
        setError('Unable to open Uber app. Please install the Uber app and try again.');
      }
    } catch (error) {
      console.error('Error booking Uber ride:', error);
      setError('Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
          <Car className="w-4 h-4 mr-2" />
          Book Uber
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Book an Uber to {destination.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Destination Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-semibold">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground">{destination.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading Uber options...</p>
            </div>
          )}

          {/* Real-time Uber Options */}
          {estimates.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Available Uber Rides</h3>
              <div className="grid gap-3">
                {estimates.map((estimate, index) => (
                  <Card key={`uber-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">
                            🚗
                          </div>
                          <div>
                            <h4 className="font-semibold">{estimate.rideType}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {estimate.estimatedTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {estimate.estimatedCost}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleBookRide(estimate.rideType)}
                          disabled={loading}
                          className="bg-black hover:bg-gray-800"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Book
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Book Buttons */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <Button
                onClick={() => handleBookRide('UberX')}
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Car className="w-4 h-4 mr-2" />
                )}
                Book Uber Now
              </Button>
            </div>
            
            {/* Fallback web link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Don't have the Uber app? 
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const webLink = getDestinationLink(destination.name);
                  window.open(webLink, '_blank');
                }}
                className="text-xs"
              >
                Open in Browser
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UberBooking;
