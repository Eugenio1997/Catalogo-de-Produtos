export interface ShoppingCartItem {
  itemQuantity: number,
  itemId: number
}


export interface ShoppingCart {
  items: ShoppingCartItem[];
}

