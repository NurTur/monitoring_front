import { EquipmentModalComponent } from './../../../shared/modals/equipment-modal/equipment-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartsModule } from 'ng2-charts';

import { SharedModule } from '../../../shared/shared.module';
import { ProjectsComponent } from './projects/projects.component';
import { PagesRoutingModule } from './pages-routing.module';
import { EditComponent } from './projects/edit/edit.component';
import { ListComponent } from './projects/list/list.component';
import { ShowComponent } from './projects/show/show.component';
import { CreatNotificationModalComponent } from '../../../shared/modals/creat-notification-modal/creat-notification-modal.component';
import { NotificationModalComponent } from '../../../shared/modals/notification-modal/notification-modal.component';
import { ChannelsModalComponent } from '../../../shared/modals/channels-modal/channels-modal.component';
import { GraphicComponent } from './projects/graphic/graphic.component';
import { NotificationComponent } from './notification/notification.component';
import { ReportComponent } from './report/report.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { DirectoryComponent } from './directory/directory.component';
import { ClientsComponent } from './clients/clients.component';
import { UsersComponent } from './users/users.component'
import { GroupsComponent } from './groups/groups.component';
import { NotProjectComponent } from './not-project/not-project.component'
@NgModule({
  declarations: [
    ProjectsComponent,
    ShowComponent,
    ListComponent,
    EditComponent,
    NotificationComponent,
    ReportComponent,
    ChannelsModalComponent,
    CreatNotificationModalComponent,
    EquipmentModalComponent,
    GraphicComponent,
    EquipmentComponent,
    DirectoryComponent,
    ClientsComponent,
    UsersComponent,
    GroupsComponent,
    NotProjectComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule,
    ChartsModule,
  ],
  exports: []
})
export class PagesModule {}
