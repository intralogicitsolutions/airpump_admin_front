import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalsRoutingModule } from './modals-routing.module';
import { SharedModule } from '../modules/shared/shared.module';

import { AssignResponsibleComponent } from './assign-responsible/assign-responsible.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    AssignResponsibleComponent
  ],
  imports: [
    CommonModule,
    ModalsRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule
  ],
})
export class ModalsModule { }
