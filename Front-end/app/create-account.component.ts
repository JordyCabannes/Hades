import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
	moduleId: module.id,
  	selector: 'my-create-account',
	templateUrl: 'create-account.component.html',
	styleUrls: [ 'create-account.component.css' ]
})

export class CreateAccountComponent{

	constructor(
	  private route: ActivatedRoute,
	  private location: Location
	) {}

	goBack(): void {
	  this.location.back();
	}
	
}