import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Vm } from './vm';
import { VMS } from './mock-vms';


@Injectable()
export class VmService {
	
	getVms(): Promise<Vm[]> {
	    return Promise.resolve(VMS);
	  }

	getVm(id: number): Promise<Vm> {
  		return this.getVms().then(vms => vms.find(vm => vm.id === id));
  	}
}