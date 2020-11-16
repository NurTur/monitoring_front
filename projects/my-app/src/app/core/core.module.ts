import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptors';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule
  ],
  exports: [
  	MainLayoutComponent
  ],
  providers:[
  	{
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
  ]
})
export class CoreModule { }
