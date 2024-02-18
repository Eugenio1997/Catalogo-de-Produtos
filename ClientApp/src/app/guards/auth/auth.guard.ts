import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {map} from "rxjs";
import {AuthService} from "@components/authentication/shared/services/auth.service";

export const AuthGuard: CanActivateFn = (
    route,
    state) => {

    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    return authService.isAuthenticated().pipe(
        map((status) => {
          if(status){
              return true;
          }

        // Pass the returnUrl as a query parameter to the signin route
        router.navigate(['/signin'], { queryParams: { returnUrl: '/products/checkout/order-summary' } });

        return false;
        })
    );
};
