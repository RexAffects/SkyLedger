"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompassCalibrationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CompassCalibrationDialog({
  open,
  onClose,
}: CompassCalibrationDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem("skyledger:compass-cal-dismissed", "1");
    }
    localStorage.setItem("skyledger:compass-first-use", "1");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Calibrate Your Compass</DialogTitle>
          <DialogDescription>
            For accurate compass behavior, calibrate your phone&apos;s magnetometer
            using the steps below. You may need to repeat until it feels accurate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Step 1: Tilt forward / back */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
              1
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Tilt forward &amp; back</p>
              <p className="text-xs text-muted-foreground">
                Hold your phone upright, then slowly tilt it forward (face down)
                and back toward you. Repeat 2-3 times.
              </p>
              <div className="flex justify-center pt-1">
                <svg viewBox="0 0 80 50" className="w-20 h-12 text-muted-foreground">
                  {/* Phone outline tilting forward/back */}
                  <rect x="28" y="5" width="24" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  <rect x="28" y="5" width="24" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-25, 40, 25)" opacity="0.3" />
                  <rect x="28" y="5" width="24" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(25, 40, 25)" opacity="0.3" />
                  {/* Arrow showing motion */}
                  <path d="M12 18 C12 10, 12 40, 12 32" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowDown)" />
                  <path d="M68 32 C68 40, 68 10, 68 18" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrowUp)" />
                  <defs>
                    <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6" fill="currentColor" />
                    </marker>
                    <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Step 2: Side to side */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
              2
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Move side to side</p>
              <p className="text-xs text-muted-foreground">
                Keep your phone upright and slowly wave it left and right in front
                of you. Repeat 2-3 times.
              </p>
              <div className="flex justify-center pt-1">
                <svg viewBox="0 0 80 50" className="w-20 h-12 text-muted-foreground">
                  {/* Phone outlines at different horizontal positions */}
                  <rect x="8" y="8" width="20" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  <rect x="30" y="8" width="20" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <rect x="52" y="8" width="20" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  {/* Horizontal arrow */}
                  <path d="M15 48 L65 48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                  <path d="M62 45 L68 48 L62 51" fill="currentColor" />
                  <path d="M18 45 L12 48 L18 51" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          {/* Step 3: Tilt left / right */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
              3
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Tilt left &amp; right</p>
              <p className="text-xs text-muted-foreground">
                Roll your phone to the left, then to the right — like turning a
                steering wheel. Repeat 2-3 times.
              </p>
              <div className="flex justify-center pt-1">
                <svg viewBox="0 0 80 50" className="w-20 h-12 text-muted-foreground">
                  {/* Phone outlines tilted left and right */}
                  <rect x="28" y="5" width="24" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-30, 40, 25)" opacity="0.3" />
                  <rect x="28" y="5" width="24" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <rect x="28" y="5" width="24" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(30, 40, 25)" opacity="0.3" />
                  {/* Curved arrow */}
                  <path d="M15 40 A25,25 0 0,1 65 40" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                  <path d="M62 37 L68 41 L61 43" fill="currentColor" />
                  <path d="M18 37 L12 41 L19 43" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer mr-auto">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            Don&apos;t show this again
          </label>
          <Button onClick={handleDismiss} size="sm">
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
