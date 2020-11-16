import { PagesModule } from './pages/pages.module';
import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { SharedModule } from '../../shared/shared.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { HeaderComponent } from './header/header.component';
import { PagesComponent } from './pages/pages.component';

@NgModule({
  declarations: [AdminComponent, HeaderComponent, PagesComponent],
  imports: [
    SharedModule,
    DragDropModule,
    AdminRoutingModule,
    PagesModule
  ]
})
export class AdminModule { }
