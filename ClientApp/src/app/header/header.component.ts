import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //properties
  public menuStatus: boolean = true;

  //Event Emitters
  @Output() sideNavToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

  //methods
  public SideNavToggle(): void {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  //hooks
  ngOnInit(): void {
    this.sideNavToggled.emit(this.menuStatus);
  }

}
