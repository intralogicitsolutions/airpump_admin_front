import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { ActionDetailsComponent } from './action-details/action-details.component';
import { CommunicationsSecurityComponent } from './communications-security/communications-security.component';
import { ControlLibraryComponent } from './control-library/control-library.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrameworksComponent } from './frameworks/frameworks.component';
import { LayoutComponent } from './layout.component';
import { ManageFrameworksComponent } from './manage-frameworks/manage-frameworks.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'manage-framework',
        component: ManageFrameworksComponent,
      },
      {
        path: 'frameworks',
        component: FrameworksComponent,
      },
      {
        path: 'control-library/:framework_id',
        component: ControlLibraryComponent,
      },
      {
        path: 'communications-security/:framework_id/:domain_id',
        component: CommunicationsSecurityComponent,
      },
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'action-details/:action_id',
        component: ActionDetailsComponent,
      },
      {
        path: 'user-setting',
        component: UserSettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
