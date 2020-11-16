import { SystemComponent } from './system/system.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'system', component: SystemComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
