import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import 'rxjs/add/operator/switchMap';
import { Vm } from './vm';

import { VmService } from './vm.service';

@Component({
  moduleId: module.id,
  selector: 'my-vm-detail',
  templateUrl: 'vm-detail.component.html',
    		styleUrls: ['vm-detail.component.css']
})

export class VmDetailComponent implements OnInit{

	@Input()
	vm: Vm;

	constructor(
	  private vmService: VmService,
	  private route: ActivatedRoute,
	  private location: Location
	) {}

	ngOnInit(): void {
  		//this.route.params
    	//		.switchMap((params: Params) => this.vmService.getVm(+params['id']))
    	//		.subscribe(vm => this.vm = vm);
	}

}