import {CanActivateFn, Router, UrlSegment} from '@angular/router';
import {inject} from "@angular/core";
import {map} from "rxjs";
import {AuthService} from "@components/authentication/shared/services/auth.service";

export const AuthGuard: CanActivateFn = (
  route,
  state) => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const orderSummaryRoute = route.url[0].path;
  return authService.isAuthenticated().pipe(
    map((status) => {
      if(status){
          return true;
      }else{
          authService.emitOrderSummaryRoute(orderSummaryRoute);
          router.navigate(['/signin']);
          return false;
      }
    })
  );
};
