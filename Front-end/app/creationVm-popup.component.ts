import { Component, HostBinding } from '@angular/core';
import { OnInit } from '@angular/core';
import { VmService } from './vm.service';
import { UserService } from './user.service';

import { Router, ActivatedRoute, Params} from '@angular/router';
import { Location }                 from '@angular/common';
import { slideInDownAnimation }   from './animation';

import { VmCreation } from './vmCreation';
import { Vm } from './vm';
import { User } from './user';


@Component({
	moduleId: module.id,
	templateUrl: 'creationVm-popup.component.html',
	styles: [ ':host { position: relative; bottom: 0%}', 
			  '#popupTot{height:100vh} ',
			  '#creationVm{ background: #FFFFFF; color:#000000; height:40vh; box-shadow: 4px 4px 6px #aaa; margin-top:30vh;transform: translateY(-50%); margin-left: 50vw; transform: translateX(-50%)}',
			  'h2{text-align:left; margin-left:5px; color:#369}',
			  '#creationVmYes{background:#369; color:#FFFFFF}',
			  '#cancel{background:#C60800; color:#FFFFFF}',
        '#errorTitle{text-align:center;}',
        '#errorDiv{margin-top:10vh;transform: translateY(-50%);}',
        '#successTitle{text-align:center;}',
        '#successDiv{margin-top:10vh;transform: translateY(-50%);}'
	],
	animations: [ slideInDownAnimation ],

})

export class CreationVmPopupComponent{
  	@HostBinding('@routeAnimation') routeAnimation = true;
  	@HostBinding('style.display')   display = 'block';
  	@HostBinding('style.position')  position = 'absolute';

    vms:Vm[]=[];
    user:User;

  	error: boolean =false;
  	created: boolean = false;
    createdYet: boolean= false;

	selectedVm: Vm;

  	constructor(private router: Router,
  		  private location: Location,
  		  private vmService: VmService,
        private route: ActivatedRoute,
        private userService: UserService
	) {}


  add(login: string, password:string, memorySize:number): void {
    login = login.trim();
    password = password.trim();
    if (!login || !password || !memorySize) { return; }
	   this.vmService.create(login, password, memorySize)
	      .subscribe(vm => {
          console.log(vm);
          this.createdYet=true;
          if(vm.containerID==-1){
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

    ngOnInit(): void {
      this.route.params
      .switchMap((params: Params) => this.userService.getUser(params['login']))
      .subscribe(user => {
          this.user=user;
          });

  }
  	
  	cancel() {
    	this.closePopup();
  	}

    goHome(){
      this.location.back;
      this.location.reload;
    }

    back(){
      this.location.back();

      this.error=false;
      this.createdYet=false;
    }

  	closePopup() {
    	// Providing a `null` value to the named outlet
    	// clears the contents of the named outlet
    	this.location.back();
;
  	}
}