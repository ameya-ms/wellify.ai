import React, { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, ShoppingCart, ExternalLink, CheckCircle } from "lucide-react";

type Rx = {
  id: string;
  name: string;
  dosage: string;
  refillsLeft: number;
  copay: string;
};

type Props = {
  open: boolean;
  id: string;
  provider: "amazon" | "walgreens";
  rx: Rx;
};

export default function PrescriptionCardDetails({ open, id, provider, rx }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string>(open ? "auto" : "0px");
  const [itemAdded, setItemAdded] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (open) {
      // expand: set explicit height to trigger transition, then switch to auto
      const scroll = el.scrollHeight;
      setHeight(`${scroll}px`);
      const t = setTimeout(() => setHeight("auto"), 300);
      return () => clearTimeout(t);
    }

    // collapse: if currently auto, snap to px then to 0
    if (height === "auto") {
      // set to current px
      setHeight(`${el.scrollHeight}px`);
      // force reflow then set to 0 to animate
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;
      requestAnimationFrame(() => setHeight("0px"));
    } else {
      setHeight("0px");
    }
    // no cleanup
    return;
  }, [open]);

  return (
    <div
      id={id}
      ref={containerRef}
      style={{ height, transition: "height 300ms ease" }}
      aria-hidden={!open}
      className="overflow-hidden"
    >
      <div className="p-4 bg-card/50 rounded-lg border border-border space-y-3">
        {provider === "amazon" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Amazon Pharmacy</span>
              <Badge className="bg-[#FF9900] text-white">Prime Eligible</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium text-foreground">{rx.copay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery:</span>
                <span className="font-medium text-success">FREE 1-2 Day Shipping</span>
              </div>
            </div>
            <Button 
              onClick={() => {
                // Open Amazon with search for the medication
                const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(rx.name)}&i=specialty-aps`;
                window.open(amazonUrl, '_blank');
              }}
              className="w-full bg-[#FFD814] hover:bg-[#FFD814]/90 text-black font-semibold"
            >
              Add to Amazon Cart
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#E31837]/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#E31837]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{rx.name}</h4>
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
                onClick={() => {
                  const walgreensUrl = `https://www.walgreens.com/search/results.jsp?Ntt=${encodeURIComponent(rx.name)}`;
                  window.open(walgreensUrl, '_blank');
                }}
                className="flex-1 bg-[#E31837] hover:bg-[#E31837]/90 text-white text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Quick Buy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const walgreensUrl = `https://www.walgreens.com/search/results.jsp?Ntt=${encodeURIComponent(rx.name)}`;
                  window.open(walgreensUrl, '_blank');
                }}
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
          </>
        )}
      </div>
    </div>
  );
}
