import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }   from './home.component';
import { VmDetailComponent }   from './vm-detail.component';



export const homeRoutes: Routes = [
	{
		path: 'home/:login',
    	component: HomeComponent,
    		children: [
  				{ path: 'detailvm/:id', component: VmDetailComponent }
  			]
  	}

];

@NgModule({
  imports: [ RouterModule.forChild(homeRoutes) ],
  exports: [ RouterModule ]
})

export class HomeRoutingModule {}