import { Injectable } from '@angular/core';
import {ShoppingCartItem, ShoppingCart} from "@interfaces/products/cart/cart";

@Injectable()
export class CartService {

  constructor() { }

  public isCartOnLocalStorage(): boolean {
    const isCartOnLocalStorage = localStorage.getItem('cart');
    return !!isCartOnLocalStorage;
  }

  public retrieveCartFromLocalStorage(): string {
      return localStorage.getItem('cart') as string;
  }

  public isNewItemOnCart(cartAsObjArr: ShoppingCart, newItem: ShoppingCartItem): boolean{
    let isNewItemOnCart: boolean = false;
    cartAsObjArr.items.filter((item: ShoppingCartItem, index: number, cart) => {
      if(cart[index].itemId == newItem.itemId){
        isNewItemOnCart = cart[index] != null;
      }
    });
    return isNewItemOnCart;
  }

  public addCartToLocalStorage(cart: ShoppingCart){
    const newItem: ShoppingCartItem =
      {
        itemQuantity: cart.items[0].itemQuantity,
        itemId: cart.items[0].itemId,
      }

    if(!this.isCartOnLocalStorage()){
      localStorage.setItem('cart', JSON.stringify(cart));
      return;
    }

    const cartAsString: string = this.retrieveCartFromLocalStorage();
    const cartAsObjArr: ShoppingCart = JSON.parse(cartAsString);

    const isNewItemOnCart = this.isNewItemOnCart(cartAsObjArr, newItem);

    if(!isNewItemOnCart){
      cartAsObjArr.items.push(newItem);
      localStorage.setItem('cart',JSON.stringify(cartAsObjArr));
    }

  }

  public removeCartFromLocalStorage(){
    localStorage.removeItem('cart');
  }

}
