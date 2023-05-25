import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseRoutingModule } from './base-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { BaseComponent } from './base.component';
import { SharedModule } from '../modules/shared/shared.module';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    BaseComponent
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    SharedModule
  ],
  exports: [SidebarComponent, HeaderComponent, BaseComponent]
})
export class BaseModule { }
