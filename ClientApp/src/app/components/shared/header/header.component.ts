import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {CartService} from "@components/checkout/services/cart.service";
import {TokenService} from "@components/authentication/shared/services/token.service";
import {AuthService} from "@components/authentication/shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {


  constructor(private _cartService: CartService,
              private changeDetector: ChangeDetectorRef,
              private _authService: AuthService,
              private _router: Router) {}



  //properties
  public isUserLoggedIn: boolean = false;
  public loggedInUsername: string = '';
  public notifier = new Subject();
  public totalQuantityOfItemsOnCart: number = 0;
  public isProductDetailOrListingLoaded: boolean = false;
  public menuStatus!: boolean;
  public screenWidth: number = 0;
  public deviceType!: Array<{ deviceType: string; isEnable: boolean }>;

  ngOnInit(): void {

    this._authService.isAuthenticated()
        .subscribe( (isAuthenticated: boolean) => {
          this.isUserLoggedIn = isAuthenticated;
        });

    this.loggedInUsername = this._authService.getLoggedInUsername();



    this._cartService
      .getIsCartDisplayedOnHeader()
      .subscribe( (isCartDisplayedOnHeader: boolean) => {
        this.totalQuantityOfItemsOnCart = this._cartService
            .retrieveTotalQuantityOfItemsOnCart();
        this.isProductDetailOrListingLoaded = isCartDisplayedOnHeader;
        this.changeDetector.detectChanges();
      });


    this._cartService
      .getTotalQuantityOfItems()
      .subscribe( (updatedTotalQuantityOfItems) => {
        this.totalQuantityOfItemsOnCart = updatedTotalQuantityOfItems
      });
  }


  //Event Emitters
  @Output() sidenavToggled: EventEmitter<boolean> = new EventEmitter<boolean>(true);


  //methods
  public sidenavToggle(): void {
    this.menuStatus = !this.menuStatus;
    this.sidenavToggled.emit(this.menuStatus);
  }

  public logout(){
    this._authService.removeToken();
    this._router.navigate(['/products']);
    this.ngOnInit();
  }


  ngOnDestroy(): void {
    this.notifier.next(5)
    this.notifier.complete();
    this.isProductDetailOrListingLoaded = false;
  }

}
