import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
	{ 
		path: '', component: SettingsComponent ,
		children : [
		    
		]
	},
	{
		path: 'reset',
		component: ResetComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
