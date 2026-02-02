import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/_core/hooks/useCart";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "Ime je obavezno"),
  lastName: z.string().min(1, "Prezime je obavezno"),
  address: z.string().min(1, "Adresa je obavezna"),
  phone: z.string().min(1, "Telefon je obavezan"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Korpa je prazna</h2>
            <p className="text-muted-foreground mb-6">
              Dodajte proizvode pre nego što nastavite sa naručivanjem
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-accent text-accent-foreground"
            >
              Nazad na proizvode
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createOrderMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phone: data.phone,
        notes: data.notes,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        totalPrice: totalPrice.toFixed(2),
      });

      if (result.success) {
        clearCart();
        toast.success("Narudžbina je uspešno poslata!");
        navigate(`/confirmation/${result.orderId}`);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Greška pri slanju narudžbine. Pokušajte ponovo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-12">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-accent hover:opacity-80 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Nazad u korpu
        </button>

        <h1 className="text-3xl font-serif font-bold mb-8">Završi Narudžbinu</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Podaci o Kupcu</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ime *</label>
                    <Input
                      {...register("firstName")}
                      placeholder="Unesite vaše ime"
                      className="w-full"
                    />
                    {errors.firstName && (
                      <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Prezime *</label>
                    <Input
                      {...register("lastName")}
                      placeholder="Unesite vaše prezime"
                      className="w-full"
                    />
                    {errors.lastName && (
                      <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Adresa *</label>
                  <Input
                    {...register("address")}
                    placeholder="Unesite vašu adresu"
                    className="w-full"
                  />
                  {errors.address && (
                    <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon *</label>
                  <Input
                    {...register("phone")}
                    placeholder="Unesite vaš telefon"
                    className="w-full"
                    type="tel"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Napomena (opciono)</label>
                  <Textarea
                    {...register("notes")}
                    placeholder="Dodatne napomene za dostavu..."
                    className="w-full"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-accent/5 border-accent/20">
              <h3 className="font-semibold mb-3">Način Plaćanja</h3>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-accent"></div>
                <span className="font-semibold">Plaćanje pouzećem (gotovinom pri dostavi)</span>
              </div>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-accent-foreground hover:opacity-90 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Slanje narudžbine...
                </>
              ) : (
                "Pošalji Narudžbinu"
              )}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-serif font-bold mb-6">Rezime Narudžbine</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} RSD
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-serif font-bold">Ukupno:</span>
                <span className="text-2xl font-bold text-accent">
                  {totalPrice.toFixed(2)} RSD
                </span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Plaćanje pouzećem pri dostavi
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
