import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, ExternalLink, ShoppingCart, MapPin, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalgreensBuyProps {
  medicationName: string;
  onPurchase?: () => void;
}

const WalgreensBuy: React.FC<WalgreensBuyProps> = ({ medicationName, onPurchase }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBuy = () => {
    // Open Walgreens with the medication name
    const walgreensUrl = `https://www.walgreens.com/search/results.jsp?Ntt=${encodeURIComponent(medicationName)}`;
    window.open(walgreensUrl, '_blank');
    
    if (onPurchase) {
      onPurchase();
    }
  };

  const handleQuickBuy = () => {
    // Direct to Walgreens cart
    const cartUrl = `https://www.walgreens.com/cart?search=${encodeURIComponent(medicationName)}`;
    window.open(cartUrl, '_blank');
    
    if (onPurchase) {
      onPurchase();
    }
  };

  return (
    <div className="w-full">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#E31837] hover:bg-[#E31837]/90 text-white justify-between"
      >
        <div className="flex items-center">
          <Truck className="w-4 h-4 mr-2" />
          Walgreens
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <Card className="mt-2 border-[#E31837]/20 bg-[#E31837]/5 w-full -mx-0">
          <CardContent className="p-4 space-y-3">
            {/* Product Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#E31837]/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#E31837]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{medicationName}</h4>
                <p className="text-xs text-muted-foreground">Available at Walgreens</p>
              </div>
              <Badge variant="secondary" className="text-xs">In Stock</Badge>
            </div>

            {/* Store Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Store Locator</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>24/7 Online</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleQuickBuy}
                className="flex-1 bg-[#E31837] hover:bg-[#E31837]/90 text-white text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Quick Buy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBuy}
                className="flex-1 text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Browse
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Free shipping on orders $35+</p>
              <p>• Same-day pickup available</p>
              <p>• Prescription refills accepted</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalgreensBuy;
