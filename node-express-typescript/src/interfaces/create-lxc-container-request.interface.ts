/**
 * Created by Halim on 10/01/2017.
 */

export interface ICreateLxcContainerRequest  {
    ostemplate : string,
    vmid : number,
    password : string,
    hostname? : string,
    description? : string,
    memory? : number,
    disk? : number
}