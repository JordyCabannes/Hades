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


    error: boolean =false;
    created: boolean = false;
    createdYet: boolean= false;
    boxCreateVm:boolean=false;

    createVm():void{
      this.boxCreateVm=true;
    }

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

   add(login: string, password:string, memorySize:number, cpusNumber:number, diskSize:number): void {
    login = login.trim();
    password = password.trim();
    if (!login || !password || !memorySize || !cpusNumber || !diskSize) { return; }
     this.vmService.create(login, password, memorySize, cpusNumber, diskSize)
        .subscribe(vm => {
          console.log(vm);
          this.createdYet=true;
          if(vm.containerID==-1){
              this.error=true;
              this.created=false;
            }
          else{
              var vmAux:Vm ={"proxmox_id": null, "node":null, "is_dedicated":null, "owner":null, "date_from":null, "date_to":null,"flavor_name":null };
              vmAux.proxmox_id = vm.containerID;
              this.vms.push(vmAux);
              this.error=false;
              this.created=true;
          }
          }
        );

    }

  	    goHome(){
    this.boxCreateVm=false; 
    this.created=false;
    this.error=false;    
     this.createdYet=false;  
    }

  	
}