
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { VmService }         from './vm.service';

import { HomeComponent } from './home.component';
import { VmDetailComponent } from './vm-detail.component';
import { CreationVmPopupComponent } from './creationVm-popup.component';



import { HomeRoutingModule }      from './home-routing.module';


@NgModule({
  imports:      [ BrowserModule,FormsModule, HomeRoutingModule],
  declarations: [HomeComponent, VmDetailComponent, CreationVmPopupComponent],
  providers: [VmService],
  bootstrap:    [ HomeComponent ]
})
export class HomeModule { }