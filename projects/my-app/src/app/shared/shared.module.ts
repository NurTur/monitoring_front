import { AngularDropdownModule } from 'angular-dropdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownDirective } from './directives/dropdown.directive';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationModalComponent } from './modals/notification-modal/notification-modal.component';
import { CreatNotificationModalComponent } from './modals/creat-notification-modal/creat-notification-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ChannelsModalComponent } from './modals/channels-modal/channels-modal.component';
import { ControllerModalComponent } from './modals/controller-modal/controller-modal.component';
import { EquipmentModalComponent } from './modals/equipment-modal/equipment-modal.component';
import { SensorTypeModalComponent } from './modals/sensor-type-modal/sensor-type-modal.component';
import { SensorModelModalComponent } from './modals/sensor-model-modal/sensor-model-modal.component';
import { ControllerModelModalComponent } from './modals/controller-model-modal/controller-model-modal.component';
import { ChannelTypeModalComponent } from './modals/channel-type-modal/channel-type-modal.component';
import { MeasuringChannelModalComponent } from './modals/measuring-channel-modal/measuring-channel-modal.component';
import { CreatePageModalComponent } from './modals/create-page-modal/create-page-modal.component';
import { ChannelTabelComponent } from './components/channel-tabel/channel-tabel.component';
import { SensorModalComponent } from './modals/sensor-modal/sensor-modal.component';
import { CreateProjectModalComponent } from './modals/create-project-modal/create-project-modal.component';
import { TagModalComponent } from './modals/tag-modal/tag-modal.component';
import { DirectoryTabelComponent } from './components/directory-tabel/directory-tabel.component';
import { SensorStatusModalComponent } from './modals/sensor-status-modal/sensor-status-modal.component';
import { ControllerStatusModalComponent } from './modals/controller-status-modal/controller-status-modal.component';
import { ChannelValueStatusModalComponent } from './modals/channel-value-status-modal/channel-value-status-modal.component';
import { ManufacturerModalComponent } from './modals/manufacturer-modal/manufacturer-modal.component';
import { CountryModalComponent } from './modals/country-modal/country-modal.component';
import { ClientModalComponent } from './modals/client-modal/client-modal.component';
import { ClientTableComponent } from './components/client-table/client-table.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    LoaderComponent,
    DropdownDirective,
    CreatePageModalComponent,
    ChannelTabelComponent,
    ControllerModalComponent,
    SensorModalComponent,
    MeasuringChannelModalComponent,
    CreateProjectModalComponent,
    TagModalComponent,
    DirectoryTabelComponent,
    ChannelTypeModalComponent,
    SensorTypeModalComponent,
    SensorModelModalComponent,
    ControllerModelModalComponent,
    SensorStatusModalComponent,
    ControllerStatusModalComponent,
    ChannelValueStatusModalComponent,
    ManufacturerModalComponent,
    CountryModalComponent,
    ClientModalComponent,
    ClientTableComponent,
    NotificationModalComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    AngularDropdownModule,
    NgxChartsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    TranslateModule,
    LoaderComponent,
    DropdownDirective,
    CreatePageModalComponent,
    ChannelTabelComponent,
    ControllerModalComponent,
    SensorModalComponent,
    MeasuringChannelModalComponent,
    CreateProjectModalComponent,
    TagModalComponent,
    DirectoryTabelComponent,
    ChannelTypeModalComponent,
    SensorTypeModalComponent,
    SensorModelModalComponent,
    ControllerModelModalComponent,
    SensorStatusModalComponent,
    ControllerStatusModalComponent,
    ChannelValueStatusModalComponent,
    ManufacturerModalComponent,
    CountryModalComponent,
    ClientModalComponent,
    ClientTableComponent,
    AngularDropdownModule,
    NgxChartsModule,
    NotificationModalComponent,
    PaginationComponent
  ],
})
export class SharedModule { }
