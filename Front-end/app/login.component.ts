import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Location }                 from '@angular/common';

import { UserService } from './user.service';

import {User } from './user';


@Component({
	moduleId: module.id,
  	selector: 'my-login',
	templateUrl: 'login.component.html',
	styleUrls: [ 'login.component.css' ]
})

export class LoginComponent{

	error: boolean =false;
  	created: boolean = false;
  	messageResultat: boolean=false;

  	selectedUser: User;

  	constructor(
	  private route: ActivatedRoute,
	  private location: Location,
	  private userService: UserService,
	  private router: Router,
	) {}

	back():void{
		this.error=false;
		this.messageResultat=false;
	}

	public signIn(login: string, password:string): void{
		login = login.trim();
	    password = password.trim();
	    if (!login || !password) { return; }
		   this.userService.get(login, password)
		      .subscribe(user => {
	          console.log(user);
	          this.messageResultat=true;
	          if (user.signIn==="ko"){
	          	this.error=true;
	          	this.created=false;
	          }
	          else{
	          	this.router.navigate(['/home', login]);
	          }
	        }
	    );
	}
	
}