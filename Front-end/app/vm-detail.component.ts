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

  public displayMessageBoxStart:boolean=false;
  public displayMessageBoxStop:boolean=false;
  public displayMessageBoxBackUp:boolean=false;
  public displayMessageBoxBackUpPleaseStopVM:boolean=false;

  public vmIsStart:boolean=false;
  public errorStart:boolean=false;
  public errorAlreadyStart:boolean=false;

  public vmIsStop:boolean=false;
  public errorStop:boolean=false;
  public errorNotStarted:boolean=true;

  public boxWait:boolean=false;

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
    this.boxWait=true;
    this.route.params
    .switchMap((params:Params) => this.vmService.startVm(+params['id']))
    .subscribe(res=>{
      console.log(res);
      this.boxWait=false;
      this.displayMessageBoxStop=false;
      this.vmIsStop=false;
      this.errorStop=false;
      this.errorNotStarted=false;
      this.displayMessageBoxStart=true;
      if(res.Information==="ok"){
        this.vmIsStart=true;
        this.errorAlreadyStart=true;
        this.errorStart=false;
        this.errorNotStarted=false;
      }
      else{
        if(this.errorAlreadyStart){
          this.vmIsStart=false;
          this.errorStart=false;
          this.errorAlreadyStart=true;
          this.errorNotStarted=false;
        }
        else{
          this.vmIsStart=false;
          this.errorStart=true;
          this.errorAlreadyStart=false;
          this.errorNotStarted=true;
        }
      }
    });
  }

  stopVmUser(){
    this.boxWait=true;
    this.route.params
    .switchMap((params:Params) => this.vmService.stopVm(+params['id']))
    .subscribe(res=>{
      this.boxWait=false;
      console.log(res);
      this.displayMessageBoxStart=false;
      this.errorStart=false;
      this.displayMessageBoxStop=true;
      if(res.Information==="ok"){
        this.errorAlreadyStart=false;
        this.vmIsStart=false;
        this.vmIsStop=true;
        this.errorNotStarted=false;
        this.errorStop=false;
      }
      else{
        if(this.errorNotStarted){
          this.vmIsStop=false;
          this.errorStop=false;
          this.errorNotStarted=true;
        }
        else{
          this.vmIsStop=false;
          this.errorStop=true;
          this.errorNotStarted=false;
        }
      }
    });
  }

  backUpVmUser(){
    this.displayMessageBoxBackUp=true;
  }

  restoreVm(){
    if(this.vmIsStart || this.errorAlreadyStart){
      this.displayMessageBoxBackUpPleaseStopVM=true;
    }
  }

  back(){
    this.displayMessageBoxStart=false;
    this.displayMessageBoxStop=false;
    this.displayMessageBoxBackUp=false;
    this.displayMessageBoxBackUpPleaseStopVM=false;
  }

}