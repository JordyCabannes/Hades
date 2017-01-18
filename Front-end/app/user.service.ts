import { Injectable }    from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';


@Injectable()
export class UserService {
	
	private usersUrl = 'http://127.0.0.1:3001';

	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }

  	private handleError(error: any): Promise<any> {
	    console.error('An error occurred', error); // for demo purposes only
	    return Promise.reject(error.message || error);
  	}

  	public create(login: string, password: string, offer: string){
  		return this.http
    		.post(this.usersUrl+'/createAccount', JSON.stringify({'login': login,'password': password,'typeofUser': offer}), {headers: this.headers})
    		.map(function(res) {
          console.log(res.json());
          return res.json();
        })
    		.catch(this.handleError);
  	}

    public get(login: string, password: string){
      return this.http
        .post(this.usersUrl+'/signIn', JSON.stringify({'login': login,'password': password}), {headers: this.headers})
        .map(function(res) {
          console.log(res.json());
          return res.json();
        })
        .catch(this.handleError);
    }

    public getUser(login: string){
      console.log(login);
      const url = `${this.usersUrl + '/User'}/${login}`;
      console.log(url);
      return this.http.get(url)
        .map(function(response) {
          console.log(response.json().user);
          return response.json().user;
        })
        .catch(this.handleError);
  }
}