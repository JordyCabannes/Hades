import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import {User } from './user';
import 'rxjs/add/operator/switchMap';
import { UserService } from './user.service';


@Component({
	moduleId: module.id,
  	selector: 'my-create-account',
	templateUrl: 'create-account.component.html',
	styleUrls: [ 'create-account.component.css' ]
})

export class CreateAccountComponent{

	error: boolean =false;
  	created: boolean = false;
  	messageResultat: boolean=false;

	constructor(
	  private route: ActivatedRoute,
	  private location: Location,
	  private userService: UserService
	) {}

	goBack(): void {
	  this.location.back();
	}

	back():void{
		this.error=false;
		this.messageResultat=false;
	}

	add(login: string, password:string, userType:string): void {
    login = login.trim();
    password = password.trim();
    userType=userType.trim();
    if (!login || !password || !userType) { return; }
	this.userService.create(login, password, userType)
	      .subscribe(user => {
	      this.messageResultat=true;
          console.log(user);
          if (user.addUser==="ko"){
          	this.error=true;
          	this.created=false;
          }
          else{
          	this.error=false;
          	this.created=true;
          }
        }
    	);

  	}
	
}