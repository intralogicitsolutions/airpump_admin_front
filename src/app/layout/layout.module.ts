import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { ManageFrameworksComponent } from './manage-frameworks/manage-frameworks.component';
import { SharedModule } from '../modules/shared/shared.module';
import { FrameworksComponent } from './frameworks/frameworks.component';
import { ControlLibraryComponent } from './control-library/control-library.component';
import { CommunicationsSecurityComponent } from './communications-security/communications-security.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApiCallService } from '../services/api-call.service';
import { AuthenticationService } from '../services/authentication.service';
import { FilterPipe } from '../services/filter.pipe';
import { ActionDetailsComponent } from './action-details/action-details.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

@NgModule({
  declarations: [
    ManageFrameworksComponent,
    FrameworksComponent,
    ControlLibraryComponent,
    CommunicationsSecurityComponent,
    DashboardComponent,
    FilterPipe,
    ActionDetailsComponent,
    UserSettingComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
  ],
  providers: [ApiCallService, AuthenticationService]
})
export class LayoutModule { }
