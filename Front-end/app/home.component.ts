import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { VmService } from './vm.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Location }                 from '@angular/common';

import { Vm } from './vm';


@Component({
	moduleId: module.id,
  	selector: 'my-home',
	templateUrl: 'home.component.html',
	styleUrls: [ 'home.component.css' ]
})

export class HomeComponent{

	vms: Vm[];
	selectedVm: Vm;

	constructor(
    private router: Router,
    private route: ActivatedRoute,
   	private location: Location,

    private vmService: VmService) { }

	gotoDetail(): void {
    	this.router.navigate(['./detailvm', this.selectedVm.id], { relativeTo: this.route });
  	}	

	onSelect(vm: Vm): void {
  		this.selectedVm = vm;
  		this.gotoDetail();
	}

	ngOnInit(): void {
    	this.getVms();
	}

	getVms(): void {
    	this.vmService.getVms().then(vms => this.vms = vms);
  	}

  	logout(){
  	}

  	
}