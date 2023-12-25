import {Component, EventEmitter, Output, OnInit, HostListener} from '@angular/core';
import {ScreenDimensionsEnum} from "@enums/screen-dimensions";
import {identifyDeviceType} from "@util/getDimensionsUtil";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  //properties
  public menuStatus!: boolean;
  public screenWidth: number = 0;
  public deviceType!: Array<{ deviceType: string; isEnable: boolean }>;


  //Event Emitters
  @Output() sidenavToggled: EventEmitter<boolean> = new EventEmitter<boolean>(true);


  //methods
  public SidenavToggle(): void {
    this.menuStatus = !this.menuStatus;
    this.sidenavToggled.emit(this.menuStatus);
  }

}
