import { NotProjectComponent } from './not-project/not-project.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentComponent } from './equipment/equipment.component';
import { ProjectsComponent } from './projects/projects.component';
import { ShowComponent } from './projects/show/show.component';
import { ListComponent } from './projects/list/list.component';
import { EditComponent } from './projects/edit/edit.component';
import { PagesComponent } from './pages.component';
import { NotificationComponent } from './notification/notification.component';
import { ReportComponent } from './report/report.component';
import { GraphicComponent } from './projects/graphic/graphic.component';
import { DirectoryComponent } from './directory/directory.component';
import { ClientsComponent } from './clients/clients.component';
import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';


const routes: Routes = [
  {
    path: '', component: PagesComponent, children: [
      { path: '', redirectTo: 'projects/:id', pathMatch: 'full' },
      { path: 'notifications/:id', component: NotificationComponent },
      { path: 'report/:id', component: ReportComponent },
      { path: 'equipment/:type/:id', component: EquipmentComponent },
      { path: 'directory', component: DirectoryComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'groups', component: GroupsComponent },
      { path: 'not-project', component: NotProjectComponent },
      { path: 'projects', component: ProjectsComponent, children: [
        { path: ':id', component: ListComponent },
        { path: 'edit/:id', component: EditComponent },
        { path: 'show/:id', component: ShowComponent },
        { path: 'graphic/:id', component: GraphicComponent }
      ]},
    ],
    // runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
