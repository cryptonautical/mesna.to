import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/_core/hooks/useCart";

export default function Cart() {
  const [, navigate] = useLocation();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container py-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-accent hover:opacity-80 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Nazad na proizvode
          </button>

          <Card className="p-12 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Korpa je prazna</h2>
            <p className="text-muted-foreground mb-6">
              Dodajte proizvode iz kataloga da biste nastavili sa naručivanjem
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-accent hover:opacity-80 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Nazad na proizvode
        </button>

        <h1 className="text-3xl font-serif font-bold mb-8">Vaša Korpa</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.productId} className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-bold mb-2">{item.name}</h3>
                    <p className="text-muted-foreground">{item.price} RSD po komadu</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-muted transition"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} RSD
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-serif font-bold mb-6">Rezime Narudžbine</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Broj stavki:</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ukupna količina:</span>
                  <span className="font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} kom
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-serif font-bold">Ukupno:</span>
                <span className="text-2xl font-bold text-accent">
                  {totalPrice.toFixed(2)} RSD
                </span>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-accent text-accent-foreground hover:opacity-90 py-3 text-lg"
              >
                Nastavi na Plaćanje
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Plaćanje pouzećem pri dostavi
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
