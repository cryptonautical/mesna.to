import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: orders, isLoading } = trpc.orders.getByUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container max-w-2xl">
          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle>Morate biti prijavljeni</CardTitle>
              <CardDescription>Prijavite se da biste videli vašu istoriju narudžbina</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                Nazad na početnu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Moja Narudžbina</h1>
          <p className="text-muted-foreground">Pregled svih vaših narudžbina</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : !orders || orders.length === 0 ? (
          <Card className="border-border">
            <CardHeader className="text-center py-12">
              <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
              <CardTitle>Nema narudžbina</CardTitle>
              <CardDescription>Još niste napravili narudžbinu. Počnite sa kupovanjem!</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                Nazad na katalog
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Narudžbina #{order.id}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {order.totalPrice} RSD
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {order.status === 'pending' && 'Na čekanju'}
                        {order.status === 'confirmed' && 'Potvrđena'}
                        {order.status === 'shipped' && 'Poslata'}
                        {order.status === 'delivered' && 'Dostavljena'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Primaoc</p>
                        <p className="font-medium text-foreground">
                          {order.firstName} {order.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Telefon</p>
                        <p className="font-medium text-foreground">{order.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Adresa</p>
                        <p className="font-medium text-foreground">{order.address}</p>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-2">Proizvodi:</p>
                        <div className="space-y-1 text-sm">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-muted-foreground">
                              <span>Proizvod ID {item.productId} x {item.quantity}</span>
                              <span>{item.price} RSD</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-1">Napomena:</p>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
