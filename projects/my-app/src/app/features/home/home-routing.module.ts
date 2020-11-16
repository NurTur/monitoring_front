import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
		{ path: '', component: HomeComponent,
			children: [
				{
			        path: '',
			        redirectTo: 'main',
			        pathMatch: 'full'
			      },
				{ path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
				{ path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }, 
				{ path: 'reset', loadChildren: () => import('./reset/reset.module').then(m => m.ResetModule) },
			]
		},
	];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
