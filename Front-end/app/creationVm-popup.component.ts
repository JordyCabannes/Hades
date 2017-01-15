import { Component, HostBinding } from '@angular/core';
import { OnInit } from '@angular/core';
import { VmService } from './vm.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Location }                 from '@angular/common';
import { slideInDownAnimation }   from './animation';

import { Vm } from './vm';


@Component({
	moduleId: module.id,
	templateUrl: 'creationVm-popup.component.html',
	styles: [ ':host { position: relative; bottom: 0%}', 
			  '#popupTot{height:100vh} ',
			  '#creationVm{ background: #FFFFFF; color:#000000; height:40vh; box-shadow: 4px 4px 6px #aaa; margin-top:30vh;transform: translateY(-50%); margin-left: 50vw; transform: translateX(-50%)}',
			  'h2{text-align:left; margin-left:5px; color:#369}',
			  '#creationVmYes{background:#369; color:#FFFFFF}',
			  '#cancel{background:#C60800; color:#FFFFFF',



	],
	animations: [ slideInDownAnimation ]
})

export class CreationVmPopupComponent{
  	@HostBinding('@routeAnimation') routeAnimation = true;
  	@HostBinding('style.display')   display = 'block';
  	@HostBinding('style.position')  position = 'absolute';

  	details: string;
  	sending: boolean = false;

  	constructor(private router: Router,
  		  private location: Location
	) {}

  	send() {
	    this.sending = true;
	    this.details = 'Sending Message...';
	    setTimeout(() => {
	      this.sending = false;
	      this.closePopup();
	    }, 1000);
	}
  	
  	cancel() {
    	this.closePopup();
  	}

  	closePopup() {
    	// Providing a `null` value to the named outlet
    	// clears the contents of the named outlet
    	this.location.back();
;
  	}
}