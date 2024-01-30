import { Injectable } from '@angular/core';
import {ShoppingCartItem, ShoppingCart} from "@interfaces/products/cart/cart";
import {Actions, QuantityOfItems} from "@interfaces/products/detail/product-detail";
import {FormGroup} from "@angular/forms";
import {map, timer} from "rxjs";

@Injectable()
export class CartService {

  public actions: Actions = {add: 'add', rem: 'rem'};
  public quantityOfItems: QuantityOfItems = {min: 1, max: 20};

  constructor() {}

  private isCartOnLocalStorage(): boolean {
    const isCartOnLocalStorage = localStorage.getItem('cart');
    return !!isCartOnLocalStorage;
  }

  public retrieveCartFromLocalStorage(): string {
      return localStorage.getItem('cart') as string;
  }

  private isNewItemOnCart(cartAsObjArr: ShoppingCart, newItem: ShoppingCartItem): boolean{
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
    else{

      const newCart = cartAsObjArr.items
        .filter( (item) => item.itemId != newItem.itemId);

      newCart.push(newItem);

      const updatedCart: ShoppingCart = {items: []}
      updatedCart.items = newCart;

      this.editCartFromLocalStorage(updatedCart);
    }


  }

  public editCartFromLocalStorage(editedCart: ShoppingCart){
    this.removeCartFromLocalStorage();
    localStorage.setItem('cart', JSON.stringify(editedCart));
  }

  private removeCartFromLocalStorage(){
    localStorage.removeItem('cart');
  }



  public checkMinAndMaxQuantityOfItems(cart: ShoppingCart, addQuantityToCartForm: FormGroup, action: string, errorName: string, currentItemIndex: number): boolean{
    if(action == this.actions.add && cart.items[currentItemIndex].itemQuantity < this.quantityOfItems.max)
      return true;


    if(action == this.actions.rem && cart.items[currentItemIndex].itemQuantity > this.quantityOfItems.min)
      return true;


    addQuantityToCartForm
      .get('addToCartOptions_' + currentItemIndex)
      ?.setErrors({
        [errorName] : true
      });


    timer(1000)
      .pipe(
        map( () => {

          addQuantityToCartForm
            .get('addToCartOptions_' + currentItemIndex)
            ?.setErrors(null);
        })
      ).subscribe();

    return false;
  }


  public addItemQuantityToList(cart: ShoppingCart, addQuantityToCartForm: FormGroup, action: string, errorName: string, currentItemIndex: number){
    const canAdd: boolean = this.checkMinAndMaxQuantityOfItems(cart, addQuantityToCartForm, action, errorName, currentItemIndex);

    if(canAdd){
      cart.items[currentItemIndex].itemQuantity++;

      addQuantityToCartForm
        .get('addToCartOptions_' + currentItemIndex)
        ?.setValue(cart.items[currentItemIndex].itemQuantity);

      this.removeCartFromLocalStorage();
      this.addCartToLocalStorage(cart);
    }
  }

  public removeItemQuantityFromList(cart: ShoppingCart, addQuantityToCartForm: FormGroup, action: string, errorName: string, currentItemIndex: number) {
    const canRem: boolean = this.checkMinAndMaxQuantityOfItems(cart, addQuantityToCartForm, action, errorName, currentItemIndex);

    if(canRem){
      cart.items[currentItemIndex].itemQuantity--;

      addQuantityToCartForm
        .get('addToCartOptions_' + currentItemIndex)
        ?.setValue(cart.items[currentItemIndex].itemQuantity);

      this.removeCartFromLocalStorage();
      this.addCartToLocalStorage(cart);

    }

  }

}
