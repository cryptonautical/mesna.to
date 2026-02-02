import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmation() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12">
      <div className="container max-w-md">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-accent" />
          </div>

          <h1 className="text-3xl font-serif font-bold mb-4">Narudžbina Potvrđena!</h1>

          <p className="text-muted-foreground mb-2">
            Vaša narudžbina je uspešno primljena.
          </p>

          <p className="text-muted-foreground mb-6">
            Potvrda narudžbine sa svim detaljima je poslata na vašu imejl adresu.
          </p>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Šta se dešava dalje?</p>
            <ul className="text-sm text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">1.</span>
                <span>Naša ekipa će potvrditi vašu narudžbinu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">2.</span>
                <span>Proizvodi će biti pakovani sa pažnjom</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">3.</span>
                <span>Dostavljač će vas kontaktirati za vreme dostave</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">4.</span>
                <span>Plaćanje pouzećem pri dostavi</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            Hvala što ste odabrali Mesna.to! Uživajte u autentičnom srpskom suvom mesu.
          </p>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-accent text-accent-foreground hover:opacity-90"
          >
            Nazad na Početnu Stranicu
          </Button>
        </Card>
      </div>
    </div>
  );
}
