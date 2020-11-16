import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { ResetRoutingModule } from './reset-routing.module';
import { ResetComponent } from './reset.component';


@NgModule({
  declarations: [ResetComponent],
  imports: [
    SharedModule,
    ResetRoutingModule
  ]
})
export class ResetModule { }
