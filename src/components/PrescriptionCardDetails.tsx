import React, { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <Button className="w-full bg-[#FFD814] hover:bg-[#FFD814]/90 text-black font-semibold">
              Add to Amazon Cart
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Walgreens Pharmacy</span>
              <Badge className="bg-[#E31837] text-white">myWalgreens</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium text-foreground">{rx.copay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup:</span>
                <span className="font-medium text-[hsl(var(--blue))]">Ready in 1 hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery:</span>
                <span className="font-medium text-success">Same-day available</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-[#E31837] hover:bg-[#E31837]/90 text-white font-semibold">Order Pickup</Button>
              <Button variant="outline" className="border-[#E31837] text-[#E31837] hover:bg-[#E31837]/10 font-semibold">Delivery</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
