import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, RefreshCw, Sparkles } from "lucide-react";
import { ShopItem, generateShopInventory, getRarityColor } from "@/lib/shopGenerator";

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  playerGold: number;
  playerLevel: number;
  onPurchase: (item: ShopItem) => void;
  onRefresh: () => void;
}

export const Shop = ({ isOpen, onClose, shopName, playerGold, playerLevel, onPurchase, onRefresh }: ShopProps) => {
  const [inventory, setInventory] = useState<ShopItem[]>(() => generateShopInventory(playerLevel));

  const handleRefresh = () => {
    setInventory(generateShopInventory(playerLevel));
    onRefresh();
  };

  const handlePurchase = (item: ShopItem) => {
    if (playerGold >= item.price) {
      onPurchase(item);
      // Remove purchased item from inventory
      setInventory(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const canAfford = (price: number) => playerGold >= price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {shopName}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Your Gold: <span className="text-accent font-bold">{playerGold}</span>
          </div>
        </DialogHeader>

        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={!canAfford(100)}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Shop (100g)
          </Button>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inventory.map((item) => (
              <Card
                key={item.id}
                className={`p-3 space-y-2 ${
                  !canAfford(item.price) ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${getRarityColor(item.rarity)}`}>
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </div>
                  </div>
                  {item.rarity === 'legendary' && (
                    <Sparkles className="w-4 h-4 text-orange-400 ml-2" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded capitalize">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent">{item.price}g</span>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford(item.price)}
                      className="h-7"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {inventory.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Shop is empty! Refresh to get new items.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
