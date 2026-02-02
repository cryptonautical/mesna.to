import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Moon, Sun, Package, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/_core/hooks/useCart";
import Loading from "@/components/Loading";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function Home() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { cart, addToCart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const productsQuery = trpc.products.list.useQuery();

  useEffect(() => {
    if (productsQuery.data) {
      setProducts(productsQuery.data as Product[]);
      setLoading(false);
    }
  }, [productsQuery.data]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {loading && <Loading />}
      {/* Header */}
      <header className="bg-accent text-accent-foreground shadow-lg">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-transparent.png" alt="Mesna.to Logo" className="h-16 w-auto" />
            <div>
              <h1 className="text-2xl font-serif font-bold">mesna.to</h1>
              <p className="text-sm opacity-90">Prodavnica Suvog Mesa</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent-foreground/20 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/orders")}
                  className="p-2 rounded-lg hover:bg-accent-foreground/20 transition"
                  aria-label="Order history"
                >
                  <Package className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    logoutMutation.mutate();
                    logout();
                  }}
                  className="p-2 rounded-lg hover:bg-accent-foreground/20 transition"
                  aria-label="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            )}
            {!isAuthenticated && (
              <a
                href="/api/auth/google"
                className="p-2 rounded-lg hover:bg-accent-foreground/20 transition"
                aria-label="Google Login"
                title="Prijava sa Google"
              >
                <LogIn className="w-6 h-6" />
              </a>
            )}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-lg hover:bg-accent-foreground/20 transition"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-12">
        <div className="container text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Autentično Srpsko Suvo Meso</h2>
          <p className="text-lg opacity-90">
            Tradicionalne recepte, savršen kvalitet, direktno do vaših vrata
          </p>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="container py-16">
        <div className="flex justify-center mb-6">
          <img src="/logo-tran-2.png" alt="Mesna.to Logo" className="max-w-xs w-100 h-100 object-contain" />
        </div>
        <h3 className="text-3xl font-serif font-bold mb-12 text-center">Naši Proizvodi</h3>
              
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h4 className="text-xl font-serif font-bold mb-2">{product.name}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">
                      {product.price} RSD
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-accent text-accent-foreground hover:opacity-90"
                    >
                      Dodaj u korpu
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16 py-8">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; 2026 Mesna.to - Sve Prava Zadržana</p>
          <p className="mt-2">Plaćanje pouzećem • Brza dostava • Garantovana kvaliteta</p>
        </div>
      </footer>
    </div>
  );
}
