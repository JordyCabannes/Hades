import { FlavorHistory } from './flavorHistory';

export interface Vm{
		proxmox_id: number,
		node: string,
		is_dedicated:boolean,
		owner:string,
		date_from:string,
		date_to:string,
		flavor_name:FlavorHistory
}

