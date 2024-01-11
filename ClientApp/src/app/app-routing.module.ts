import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';

const appRoutes: Routes = [

    {
      path: 'products',
      loadChildren: () => import('./components/products/product.module').then(p => p.ProductModule)
    },
    {
      path: 'signin',
      loadChildren: () => import('./components/authentication/auth.module').then(a => a.AuthModule)

    },
    {
      path: 'signup',
      loadChildren: () => import('./components/authentication/auth.module').then(a => a.AuthModule)
    },
    {
      path: '',
      redirectTo: "products",
      pathMatch:"full"
    },
    {
      path: '**',
      redirectTo: "products",
      pathMatch:"full"
    }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppRoutingModule { }
