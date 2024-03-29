import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {CartService} from "@components/checkout/services/cart.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {


  constructor(private _cartService: CartService,
              private changeDetector: ChangeDetectorRef) {}



  //properties
  public notifier = new Subject();
  public totalQuantityOfItemsOnCart: number = 0;
  public isProductDetailOrListingLoaded: boolean = false;
  public menuStatus!: boolean;
  public screenWidth: number = 0;
  public deviceType!: Array<{ deviceType: string; isEnable: boolean }>;

  ngOnInit(): void {

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


  ngOnDestroy(): void {
    this.notifier.next(5)
    this.notifier.complete();
    this.isProductDetailOrListingLoaded = false;
  }

}
