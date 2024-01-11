import {AbstractControl, FormGroup} from "@angular/forms";

export function MustMatchValidator(controlName: string, matchControlName: string) {
  return (formGroup: FormGroup): any => {
    const control: AbstractControl = formGroup.controls[controlName];
    const controlMatching: AbstractControl = formGroup.controls[matchControlName];

    if(controlMatching.errors &&
      !controlMatching.errors.passwordMatchValidator){

      controlMatching.setErrors(null);
    }

    if(control.value != controlMatching.value){

      controlMatching.setErrors({
        passwordMatchValidator: true
      });
    }
    else{
      controlMatching.setErrors(null);
    }
  };

}

