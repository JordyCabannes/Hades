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

  	public create(login: string, password: string, memorySize: number, cpusNumber:number, diskSize:number){
  		return this.http
    		.post(this.vmsUrl+'/createVM', JSON.stringify({'login': login,'password': password,'memory': memorySize, 'cpus':cpusNumber, 'disk':diskSize}), {headers: this.headers})
    		.map(function(res) {
          console.log(res.json());
          return res.json();
        })
    		.catch(this.handleError);
  	}

  public getVms(login: string){
      console.log(login);
      const url = `${this.vmsUrl + '/UserVMs'}/${login}`;
      console.log(url);
      return this.http.get(url)
        .map(function(response) {
          console.log(response.json());
          return response.json().listVM;
        })
        .catch(this.handleError);
  }

    public getVm(id: number){
      console.log(id);
      const url = `${this.vmsUrl + '/VM'}/${id}`;
      console.log(url);
      return this.http.get(url)
        .map(function(response) {
          console.log(response.json().VM);
          return response.json().VM;
        })
        .catch(this.handleError);
  }

  public startVm(id:number){
      const url = `${this.vmsUrl + '/startVM'}/${id}`;
      console.log(url);
      return this.http.get(url)
        .map(function(response) {
          console.log(response.json());
          return response.json();
        })
        .catch(this.handleError);
  }

  public stopVm(id:number){
      const url = `${this.vmsUrl + '/stopVM'}/${id}`;
      console.log(url);
      return this.http.get(url)
        .map(function(response) {
          console.log(response.json());
          return response.json();
        })
        .catch(this.handleError);
  }

  public monitoring(id: number){
    const url = `${this.vmsUrl + '/monitoring'}/${id}`;
    console.log(url);
      return this.http.get(url)
        .map(function(response) {
          //console.log(response.json());
          return response.json();
        })
        .catch(this.handleError);
  }

  public createBackUp(login:string, id: number){
    return this.http
        .post(this.vmsUrl+'/createBackup', JSON.stringify({'login': login,'id': id}), {headers: this.headers})
        .map(function(res) {
          console.log(res.json());
          return res.json();
        })
        .catch(this.handleError);
  }

  public restoreBackUp(login:string, id: number){
    return this.http
        .post(this.vmsUrl+'/restoreBackup', JSON.stringify({'login': login,'id': id}), {headers: this.headers})
        .map(function(res) {
          console.log(res.json());
          return res.json();
        })
        .catch(this.handleError);
  }
}