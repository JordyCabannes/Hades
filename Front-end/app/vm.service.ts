import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Vm } from './vm';


@Injectable()
export class VmService {
	
	private vmsUrl = 'http://127.0.0.1:3001';

	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }

	//getVms(): Promise<Vm[]> {
	//    return Promise.resolve(VMS);
	//  }

	//getVm(id: number): Promise<Vm> {
  	//	return this.getVms().then(vms => vms.find(vm => vm.id === id));
  	//}


  	private handleError(error: any): Promise<any> {
	    console.error('An error occurred', error); // for demo purposes only
	    return Promise.reject(error.message || error);
  	}

  	public create(login: string, password: string, memorySize: number):Promise<Vm>{
  		return this.http
    		.post(this.vmsUrl+'/createVM', JSON.stringify({'login': login,'password': password,'memory': memorySize}), {headers: this.headers})
    		.toPromise()
    		.then(res => res.json().data)
    		.catch(this.handleError);
  	}
}