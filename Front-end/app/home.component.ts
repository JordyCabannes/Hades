import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { VmService } from './vm.service';
import { UserService } from './user.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Location }                 from '@angular/common';

import { Vm } from './vm';
import { User } from './user';

@Component({
	moduleId: module.id,
  	selector: 'my-home',
	templateUrl: 'home.component.html',
	styleUrls: [ 'home.component.css' ]
})

export class HomeComponent{

  @Input()
  user: User;

	public vms: Vm[]=[];
	selectedVm: Vm;

	constructor(
    private router: Router,
    private route: ActivatedRoute,
   	private location: Location,
    private userService: UserService,
    private vmService: VmService) { }

	gotoDetail(): void {
    	this.router.navigate(['./detailvm', this.selectedVm.proxmox_id], { relativeTo: this.route });
  	}	

	onSelect(vm: Vm): void {
  		this.selectedVm = vm;
  		this.gotoDetail();
	}

      private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      return Promise.reject(error.message || error);
    }

	ngOnInit(): void {
    	this.route.params
      .switchMap((params: Params) => this.userService.getUser(params['login']))
      .subscribe(user => {
          this.user=user;
          });
          this.getVms();

	}

	getVms(): void {
    this.route.params
      .switchMap((params: Params) => this.vmService.getVms(params['login']))
      .subscribe(vms => {
        //console.log(vms.length);
        for(var i = 0;i<vms.length;i++) {
          console.log(vms[i]); 
           this.vms.push(vms[i]);
        }
          //console.log("//////// vms : "+this.vms[0].proxmox_id);
    });
  }

  	logout(){
  	}

  	
}