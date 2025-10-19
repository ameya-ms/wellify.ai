import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Clock, DollarSign, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { lyftService, LyftRideRequest, LyftRideEstimate, LyftBookingResult } from '@/services/lyftService';

interface LyftBookingProps {
  destination: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  onRideBooked?: (result: LyftBookingResult) => void;
}

const LyftBooking: React.FC<LyftBookingProps> = ({ destination, onRideBooked }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimates, setEstimates] = useState<LyftRideEstimate[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !userLocation) {
      loadUserLocation();
    }
  }, [isOpen]);

  const loadUserLocation = async () => {
    try {
      const location = await lyftService.getCurrentLocation();
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
      const request: LyftRideRequest = {
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

      const rideEstimates = await lyftService.getRideEstimates(request);
      setEstimates(rideEstimates);
    } catch (error) {
      setError('Failed to load ride estimates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideType: string) => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const request: LyftRideRequest = {
        pickup: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destination.address
        }
      };

      console.log('Booking Lyft ride with request:', request);
      const result = await lyftService.bookLyftRide(request);
      console.log('Lyft booking result:', result);

      if (result.success) {
        // Try to open the Lyft app first
        try {
          if (result.deepLink) {
            window.location.href = result.deepLink;
            
            // Fallback: open web link after a delay
            setTimeout(() => {
              if (result.webLink) {
                window.open(result.webLink, '_blank');
              }
            }, 1000);
          }
          
          if (onRideBooked) {
            onRideBooked(result);
          }
          
          setIsOpen(false);
        } catch (linkError) {
          console.error('Error opening Lyft link:', linkError);
          setError('Unable to open Lyft app. Please install the Lyft app and try again.');
        }
      } else {
        setError(result.error || 'Failed to book ride');
      }
    } catch (error) {
      console.error('Error booking Lyft ride:', error);
      setError('Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">
          <Car className="w-4 h-4 mr-2" />
          Book Lyft
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Book a Lyft to {destination.name}
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
              <p className="text-sm text-muted-foreground">Loading Lyft options...</p>
            </div>
          )}

          {/* Lyft Options */}
          {estimates.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Available Lyft Rides</h3>
              <div className="grid gap-3">
                {estimates.map((estimate, index) => (
                  <Card key={`lyft-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm">
                            🚕
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
                          className="bg-pink-500 hover:bg-pink-600"
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
                onClick={() => handleBookRide('Lyft')}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Car className="w-4 h-4 mr-2" />
                )}
                Book Lyft Now
              </Button>
            </div>
            
            {/* Fallback web link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Don't have the Lyft app? 
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const webLink = `https://www.lyft.com/rider?pickup[latitude]=${userLocation?.latitude}&pickup[longitude]=${userLocation?.longitude}&destination[latitude]=${destination.latitude}&destination[longitude]=${destination.longitude}`;
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

export default LyftBooking;
