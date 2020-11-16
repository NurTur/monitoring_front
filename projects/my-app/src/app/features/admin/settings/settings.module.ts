import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ResetComponent } from './reset/reset.component';
import {SettingsComponent} from './settings.component';
import { SharedModule } from '../../../shared/shared.module';
@NgModule({
  declarations: [
  	ResetComponent,
  	SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
