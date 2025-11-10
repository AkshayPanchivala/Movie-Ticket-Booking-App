import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StripePayment } from '@/components/StripePayment';
import * as paymentService from '@/services/payment.service';
import { useConfig } from '@/contexts/ConfigContext';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmPayment: (paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'stripe', paymentDetails: Record<string, any>) => void;
  totalAmount: number;
  movieTitle: string;
  seatCount: number;
  processing: boolean;
  showId?: string;
  seatIds?: string[];
}

export function PaymentModal({
  open,
  onClose,
  onConfirmPayment,
  totalAmount,
  movieTitle,
  seatCount,
  processing,
  showId,
  seatIds,
}: PaymentModalProps) {
  const { platformFee, currencySymbol } = useConfig();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  
  const [loadingStripe, setLoadingStripe] = useState(false);

  // Create Stripe payment intent when modal opens
  useEffect(() => {
    if (open && showId && seatIds && seatIds.length > 0) {
      createStripePaymentIntent();
    }
  }, [open, showId, seatIds]);

  const createStripePaymentIntent = async () => {
    if (!showId || !seatIds) return;

    try {
      setLoadingStripe(true);
      const response = await paymentService.createPaymentIntent({
        show_id: showId,
        seat_ids: seatIds,
      });

      setStripeClientSecret(response.data.client_secret);
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to initialize payment');
      console.error('Stripe payment intent error:', error);
    } finally {
      setLoadingStripe(false);
    }
  };

  const handleStripePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess(true);
    setTimeout(() => {
      onConfirmPayment('stripe', { payment_intent_id: paymentIntentId });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {!paymentSuccess ? (
            <motion.div
              key="payment-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">Complete Payment</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Secure checkout for your movie tickets
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Order Summary */}
                <div className="bg-gradient-to-br from-primary/10 to-amber-500/10 rounded-xl p-6 border border-primary/20">
                  <h3 className="font-bold text-lg mb-4 text-foreground">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Movie</span>
                      <span className="font-semibold text-foreground">{movieTitle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Number of Seats</span>
                      <span className="font-semibold text-foreground">{seatCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Booking Fee</span>
                      <span className="font-semibold text-foreground">{currencySymbol}{platformFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-primary/20 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg text-foreground">Total Amount</span>
                        <span className="font-bold text-2xl text-primary">
                          {currencySymbol}{(totalAmount + platformFee).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method - Stripe Only */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-foreground">Payment Method</h3>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-primary bg-primary/5">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">Stripe Payment</span>
                      <span className="text-xs text-muted-foreground">Secure payment gateway</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form - Stripe */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {loadingStripe ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Initializing payment...</span>
                    </div>
                  ) : stripeClientSecret ? (
                    <StripePayment
                      clientSecret={stripeClientSecret}
                      amount={totalAmount + platformFee}
                      onSuccess={handleStripePaymentSuccess}
                      onCancel={onClose}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Failed to initialize payment. Please try again.</p>
                    </div>
                  )}
                </motion.div>

                {/* Cancel Button Only - Payment handled by Stripe */}
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={processing || loadingStripe}
                    className="w-full rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="w-24 h-24 mx-auto text-green-500 mb-6" />
              </motion.div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Payment Successful!</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Your booking has been confirmed
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
                <p className="text-sm text-muted-foreground mt-3">Redirecting to bookings...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
