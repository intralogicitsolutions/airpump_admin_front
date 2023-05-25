import { Component, EventEmitter, Output, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() SideNavToggle = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }
  openSidenav() {
    this.SideNavToggle.emit();

  }
}