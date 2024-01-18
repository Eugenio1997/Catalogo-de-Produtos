export interface CartItem {
  name: string;
  price: number;
  id: number;
}

export interface Cart {
  quantityOfItems: number;
  itemInfo: CartItem;
}

export interface Modal {
  title: string;
  body: string;
  buttonBackgroundColor: string;
  fromComponent?: string
}

export interface Actions {
  add: string;
  rem: string;
}

export interface ErrorName {
  min: string;
  max: string;
}

export interface QuantityOfItems {
  min: number,
  max: number
}
