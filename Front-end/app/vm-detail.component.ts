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
	public vm: Vm;
  public vmIsStart:boolean=false;
  public displayMessageBox:boolean=true;

	constructor(
	  private vmService: VmService,
	  private route: ActivatedRoute,
	  private location: Location
	) {}

	ngOnInit(): void {
  		this.route.params
    		.switchMap((params: Params) => this.vmService.getVm(+params['id']))
    		.subscribe(vm => {
    			console.log(vm);
    			this.vm = vm;
    		});
	}

  startVmUser(){
    this.route.params
    .switchMap((params:Params) => this.vmService.startVm(+params['id']))
    .subscribe(res=>{
      console.log(res);
      this.displayMessageBox=true;
      if(res.Information==="ok"){
        this.vmIsStart=true;
      }
      else{
        this.vmIsStart=false;
      }
    });
  }

}