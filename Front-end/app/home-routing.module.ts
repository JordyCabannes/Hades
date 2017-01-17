import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }   from './home.component';
import { VmDetailComponent }   from './vm-detail.component';
import { CreationVmPopupComponent } from './creationVm-popup.component';



export const homeRoutes: Routes = [
	{
		path: 'home',
    	component: HomeComponent,
    		children: [
  				{ path: 'detailvm/:id', component: VmDetailComponent },
          {path: 'createvm', component: CreationVmPopupComponent, outlet: 'popupCreationVm'},
  			]
  	}

];

@NgModule({
  imports: [ RouterModule.forChild(homeRoutes) ],
  exports: [ RouterModule ]
})

export class HomeRoutingModule {}