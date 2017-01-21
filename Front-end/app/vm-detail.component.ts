import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import 'rxjs/add/operator/switchMap';
import { Vm } from './vm';
import { VmMonitoring } from './vmMonitoring';

import { VmService } from './vm.service';
import { WindowService } from './window.service';

@Component({
  moduleId: module.id,
  selector: 'my-vm-detail',
  templateUrl: 'vm-detail.component.html',
    		styleUrls: ['vm-detail.component.css']
})

export class VmDetailComponent implements OnInit{

	@Input()
	public vm: Vm;

  public nativeWindow: any;

  @Input()
  public vmMonitoring:VmMonitoring;

  @Input()
  public upTimeDate:string;

  @Input()
  public maxRam:string;

  @Input()
  public usageCPU:string;

  @Input()
  public usageRam:string;

  public displayMessageBoxStart:boolean=false;
  public displayMessageBoxStop:boolean=false;
  public displayMessageBoxBackUp:boolean=false;
  public displayMessageBoxBackUpPleaseStopVM:boolean=false;
  public displayMessageBoxConsolePleaseStartVM:boolean=false;


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
	  private location: Location,
    private winRef: WindowService
	) {
    this.nativeWindow = winRef.getNativeWindow();
  }

	ngOnInit(): void {
  		this.route.params
    		.switchMap((params: Params) => this.vmService.getVm(+params['id']))
    		.subscribe(vm => {
    			console.log(vm);
    			this.vm = vm;
      });
      this.startMonitoring();


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
        this.errorAlreadyStart=false;
        this.errorStart=false;
        this.errorNotStarted=false;
      }
      else{
        if(this.vmIsStart){
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
        this.i=0;
        this.iH=0;
      }
      else{
        if(!this.vmIsStart){
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
    this.displayMessageBoxConsolePleaseStartVM=false;
  }

    public openTabConsole(): void {
      if(this.vmIsStart || this.errorAlreadyStart){
        var url = 'https://213.32.27.237:8006/?console=lxc&novnc=1&vmid='+this.vm.proxmox_id+'&vmname=CT'+this.vm.proxmox_id+'&node=ns3060138';
        console.log(url);
       var newWindow = this.nativeWindow.open(url);
      }
      else{
        this.displayMessageBoxConsolePleaseStartVM=true;
      }
    }

    public i:number=0;
    public iH:number=0;

    public monitoringVm(){
      if(this.vmIsStart)
      {
        this.route.params
        .switchMap((params:Params) => this.vmService.monitoring(+params['id']))
        .subscribe(res=>{
          console.log(res);
          this.vmMonitoring=res;
          this.vmMonitoring.cpu=100*this.vmMonitoring.cpu;
          this.maxRam=this.vmMonitoring.maxmem/1000000;
          this.maxRam=this.maxRam.toFixed(3)+" Mo";
          this.usageRam=this.vmMonitoring.mem/1000000;
          this.usageRam=this.usageRam.toFixed(3)+" Mo";
          this.usageCPU=this.vmMonitoring.cpu.toFixed(2);

          var secondes = this.vmMonitoring.uptime%60;
          var minutes =(this.vmMonitoring.uptime/60)%60;
          if(this.i>0){
            if((minutes%this.i)>0){
              minutes=this.i;
            }
            else{
              this.i=this.i+1;
            }
          }
          else{
            if((minutes%1)==0 && minutes!=0){
              this.i=this.i+1;
              minutes=this.i;
            }
            else{
              minutes=this.i;
            }
          }
          var heures = this.vmMonitoring.uptime/3600;
          if(this.iH>0){
            if((heures%this.iH)>0){
              heures=this.iH;
            }
            else{
              this.iH=this.iH+1;
            }
          }
          else{
            if((heures%1)==0 && heures!=0){
              this.iH=this.iH+1;
              heures=this.iH;
            }
            else{
              heures=this.iH;
            }
          }
          this.upTimeDate=heures.toFixed(0)+":"+minutes.toFixed(0)+":"+secondes.toFixed(0);
        });
      }
      }

    public startMonitoring(){
      setInterval(() => {this.monitoringVm();}, 900);
    }

}