import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import './rxjs-extensions';

import { VmService }         from './vm.service';

import { AppComponent }  from './app.component';
import { LoginComponent } from './login.component';
import { CreateAccountComponent } from './create-account.component';
import { HomeComponent } from './home.component';
import { VmDetailComponent } from './vm-detail.component';



import { AppRoutingModule }     from './app-routing.module';
import { HomeModule }      from './home.module';


@NgModule({
  imports:      [ BrowserModule,FormsModule,AppRoutingModule, HomeModule, HttpModule],
  declarations: [ AppComponent, LoginComponent, CreateAccountComponent],
  providers: [VmService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }