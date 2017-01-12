/**
 * Created by Halim on 12/01/2017.
 */

export interface IGetContainerStatusReply {
    "cpu" : number,
    "cpus" : number,
    "disk" : number,
    "diskread" : string,
    "diskwrite" : string,
    "ha" : {
        "managed" : number
    },
    "lock" : string,
    "maxdisk" : number,
    "maxmem" : number,
    "maxswap" : number,
    "mem" : number,
    "name" : string,
    "netin" : number,
    "netout" : number,
    "pid" : string,
    "status" : string,
    "swap" : number,
    "template" : string,
    "type" : string,
    "uptime" : number
}
