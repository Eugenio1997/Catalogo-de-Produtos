import {FormControl, Validators} from "@angular/forms";

export interface Category {
  invalid: string
}

export interface Quantity {
  maxLength: number,
  maxValue: string
}
export class CustomValidators extends Validators{

  static validateCategoryName(control: FormControl) {
    const category: Category = {
      invalid: '-- Selecione a categoria do produto --'
    };

    if (control.value && control.value == category.invalid) {
      return { invalidCategoryName: true };
    } else {
      return null;
    }
  }

  static validateMaxQuantityInput(control: FormControl){
    const quantity: Quantity = {
      maxLength: 3,
      maxValue: '100'

    }
    let controlValueAsString = String(control.value);
    if(controlValueAsString.length >= quantity.maxLength &&
    controlValueAsString > quantity.maxValue)
      return { invalidMaxQuantity: true };

    return null;
  }
}
