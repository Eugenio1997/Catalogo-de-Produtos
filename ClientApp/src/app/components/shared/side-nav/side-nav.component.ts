import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {sidenavItems} from "./sidenav-items";
import {SidenavService} from "@shared/side-nav/sidenav.service";
import {identifyDeviceType} from "@util/getDimensionsUtil";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnChanges, OnInit{

  constructor(
    private _sidenavService: SidenavService) {
  }

  ngOnInit(): void {
    this._sidenavService
      .setSidenavStatus$(this.sidenavStatus)
    this.onResize();
  }

  //properties
  @Input() sidenavStatus!: boolean;
  public deviceType!: Array<{ deviceType: string; isEnable: boolean }>;
  public screenWidth: number = 0;
  public _sidenavItems: {number: number, name: string, icon: string, route: string}[] = sidenavItems;
  @Output() sidenavToggled: EventEmitter<boolean> = new EventEmitter<boolean>(true);


  ngOnChanges(changes: SimpleChanges): void {
    this._sidenavService
      .setSidenavStatus$(this.sidenavStatus)
  }

  @HostListener('window:resize')
  onResize(): void{
    //innerWidth returns the width of the window's layout viewport
    this.screenWidth = window.innerWidth;
    this.deviceType = identifyDeviceType(this.screenWidth);
    this.checkIfOpenMenu(this.deviceType);
  }

  public checkIfOpenMenu(deviceType: {deviceType: string, isEnable: boolean}[]): any {
    if(deviceType[0].isEnable) {
      this.sidenavStatus = false;
      this.sidenavToggled.emit(this.sidenavStatus);
    }
    else if(deviceType[1].isEnable){
      this.sidenavStatus = true;
      this.sidenavToggled.emit(this.sidenavStatus);

    }
  }

}
