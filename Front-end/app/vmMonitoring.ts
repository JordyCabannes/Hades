export interface VmMonitoring{

	Information:string,
	cpu:number,
	cpus:number,
	disk:number,
	diskread:string,
	diskwrite:string,
	ha:Object,
	lock:string
	maxdisk:number,
	maxmem:number,
	maxswap:number,
	mem:number,
	name:string,
	netin:number,
	netout:number,
	pid:string,
	status:string,
	swap:number,
	template:string,
	type:string,
	uptime:number,
}