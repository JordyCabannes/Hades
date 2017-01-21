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

  @Input()
  public maxdisk:string;

  @Input()
  public usageDisk:string;

  @Input()
  public diskRead:string;

  @Input()
  public diskWrite:string;

  @Input()
  public backUpCreated:boolean=false;

  @Input()
  public errorBackUpCreation:boolean=false;

  @Input()
  public backUpRestored:boolean=false;

  @Input()
  public errorBackUpRestoring:boolean=false;

  public displayMessageBoxStart:boolean=false;
  public displayMessageBoxStop:boolean=false;
  public displayMessageBoxBackUp:boolean=false;
  public displayMessageBoxBackUpPleaseStopVM:boolean=false;
  public displayMessageBoxConsolePleaseStartVM:boolean=false;
  public displayMessageBackUpResult:boolean=false;


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
    else{
      this.boxWait=true;
      this.route.params
      .switchMap((params:Params) => this.vmService.restoreBackUp(this.vm.owner, +params['id']))
      .subscribe(res=>{
        this.boxWait=false;
        this.displayMessageBackUpResult=true;
        if(res.Information=="ok"){
          this.backUpRestored=true;
        }
        else{
          this.errorBackUpRestoring=true;
        }
      });
    }
  }

  createBackUp(){
    this.boxWait=true;
    console.log(this.vm.owner);
      this.route.params
      .switchMap((params:Params) => this.vmService.createBackUp(this.vm.owner, +params['id']))
      .subscribe(res=>{
        this.boxWait=false;
        this.displayMessageBackUpResult=true;
        if(res.Information=="ok"){
          this.backUpCreated=true;
        }
        else{
          this.errorBackUpCreation=true;
        }
      });
  }

  back(){
    this.displayMessageBoxStart=false;
    this.displayMessageBoxStop=false;
    this.displayMessageBoxBackUp=false;
    this.displayMessageBoxBackUpPleaseStopVM=false;
    this.displayMessageBoxConsolePleaseStartVM=false;
    this.displayMessageBackUpResult=false;
    this.backUpCreated=false;
    this.errorBackUpCreation=false;
    this.errorBackUpRestoring=false;
    this.backUpRestored=false;
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


    public monitoringVm(){
        this.route.params
        .switchMap((params:Params) => this.vmService.monitoring(+params['id']))
        .subscribe(res=>{
          if(res.status=="running"){
            if(this.vmIsStart==false && this.errorAlreadyStart==false){
              this.vmIsStart=true;
            }
            //console.log(res);
            this.vmMonitoring=res;
            this.vmMonitoring.cpu=100*this.vmMonitoring.cpu;
            this.usageCPU=this.vmMonitoring.cpu.toFixed(2);

            this.vmMonitoring.maxmem=this.vmMonitoring.maxmem/1000000;
            this.maxRam=this.vmMonitoring.maxmem.toFixed(3)+" Mo";
            this.vmMonitoring.mem=this.vmMonitoring.mem/1000000;
            this.usageRam=this.vmMonitoring.mem.toFixed(3)+" Mo";

            this.vmMonitoring.maxdisk=this.vmMonitoring.maxdisk/1000000;
            this.maxdisk=this.vmMonitoring.maxdisk.toFixed(3)+" Go";
            this.vmMonitoring.disk=this.vmMonitoring.disk/1000000;
            this.usageDisk=this.vmMonitoring.disk.toFixed(3)+" Go";
            this.diskRead = ((+this.vmMonitoring.diskread)/1000000).toFixed(3)+" Go";
            this.diskWrite = ((+this.vmMonitoring.diskwrite)/1000000).toFixed(3)+" Go";
          
            var minutesAux=0;

            var secondes = this.vmMonitoring.uptime%60;
            var minutes =(this.vmMonitoring.uptime/60)%60;

            var heures = this.vmMonitoring.uptime/3600;



            this.upTimeDate=Math.floor(heures)+":"+Math.floor(minutes)+":"+Math.floor(secondes);
          }
          else{
            this.vmMonitoring=null;
          }
        });
      }

    public startMonitoring(){
      setInterval(() => {this.monitoringVm();}, 100);
    }

}