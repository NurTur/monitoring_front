import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

import { SharedModule } from '../../../shared/shared.module';
import { SystemComponent } from './system/system.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [MainComponent, SystemComponent, AboutComponent],
  imports: [
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
