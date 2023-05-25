import { Component, OnInit, EventEmitter, Output, HostBinding } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarComponent implements OnInit {
  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Output() closeSideNav = new EventEmitter();
  authStatus = true;

  constructor(
	private router: Router, 
	private authenticationService: AuthenticationService ) 
  { 
	const userData: any = localStorage.getItem('user');
    const parsedData = JSON.parse(userData);
	if (parsedData.data.access_rights != 'ADMIN') this.authStatus = false;
  }

  onToggleClose() {
    this.closeSideNav.emit();
  }

  ngOnInit() { }
  onItemSelected() {
    // if (!item.children || !item.children.length) {
    //   //   this.router.navigate([item.route]);
    //   //   this.navService.closeNav();
    // }
    // if (item.children && item.children.length) {
    this.expanded = !this.expanded;
    // }
  }
  
  logOut() {
    this.authenticationService.logout();
	this.router.navigate(['/login']);
  }
  
  
}
