import {HttpService} from "./http.service";
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";
import {IGetContainerStatusReply} from "../interfaces/get-container-status-reply.interface";
import {ICreateContainerBackupRequest} from "../interfaces/create-container-backup-request";
import {ICreateContainerBackupReply} from "../interfaces/create-container-backup-reply.interface";
import {IRestoreLxcContainerRequest} from "../interfaces/restore-lxc-container-request.interface";
import {IRestoreLxcContainerReply} from "../interfaces/restore-lxc-container-reply.interface";

/**
 * Created by Halim on 09/01/2017.
 */

export class ProxmoxApiService
{
    private httpService : HttpService;
    private endpoint : string;
    private CSRF : string;
    private ticket : {[id:string]:any;};

    constructor(endpoint : string, ticket : {[id:string]:any;}, CSRF : string)
    {
        this.endpoint =  endpoint;
        this.ticket = ticket;
        this.CSRF = CSRF;

        var httpheaders = {
            'Accept':'application/json',
            'CSRFPreventionToken':this.CSRF
        };

        this.httpService = new HttpService(this.endpoint, httpheaders, this.ticket);
    }

    /*vm doit être éteinte pour pouvoir faire la backup*/
    public async restoreLxcContainer(node : string, restoreLxcContainerRequest : IRestoreLxcContainerRequest) : Promise<IRestoreLxcContainerReply>
    {
        var finalUrl = `/nodes/${node}/lxc`;
        restoreLxcContainerRequest['restore'] = 1;
        restoreLxcContainerRequest['force'] = 1;
        var response = await this.httpService.post(finalUrl, restoreLxcContainerRequest);

        if(response.code != 200)
            return null;

        return {
            upid : response.getBody()['data']
        };
    }


    public async createContainerBackup(node : string, createContainerBackupRequest : ICreateContainerBackupRequest) : Promise<ICreateContainerBackupReply>
    {
        var finalUrl = `/nodes/${node}/vzdump`;
        var response = await this.httpService.post(finalUrl, createContainerBackupRequest);

        if(response.code != 200)
            return null;

        var upid : string = response.getBody()['data'];
        var iBegin = nth_occurrence(upid, ':', 4) + 1;
        var iEnd = nth_occurrence(upid, ':', 5);
        var hexTimestamp = upid.substring(iBegin, iEnd);
        var timestamp = parseInt(hexTimestamp, 16);
        var date = new Date(timestamp*1000);
        var vmid = createContainerBackupRequest.vmid;
        var storage = createContainerBackupRequest.storage;
        var year = leftPad(date.getUTCFullYear(), 4);
        var month = leftPad(date.getUTCMonth() + 1, 2);
        var day = leftPad(date.getUTCDate(), 2);
        var hours = leftPad(date.getHours(), 2);
        var minutes = leftPad(date.getMinutes(), 2);
        var seconds = leftPad(date.getSeconds(), 2);

        var backup = `/custom/backups/dump/vzdump-lxc-${vmid}-${year}_${month}_${day}-${hours}_${minutes}_${seconds}.tar.lzo`;
        return {
            upid : upid,
            backup : backup
        };
    }

    public async getContainerStatus(node : string, vmid : number) : Promise<IGetContainerStatusReply>
    {
        var finalUrl = `/nodes/${node}/lxc/${vmid}/status/current`;
        var response = await this.httpService.get(finalUrl);

        if(response.code != 200)
            return null;

        var body = <IGetContainerStatusReply>response.getBody()['data'];
        return body;
    }

    public async getClusterVmNextId() : Promise<IGetClusterVmNextIdReply>
    {
        var finalUrl = `/cluster/nextid`;
        var response = await this.httpService.get(finalUrl);

        if(response.code != 200)
            return null;

        var id = +response.getBody()['data'];

        return {
            id: id
        }
    }

    public async createLxcContainer(node : string, lxcContainerRequest : ICreateLxcContainerRequest) : Promise<ICreateLxcContainerReply>
    {
        var finalUrl = `/nodes/${node}/lxc`;
        var response = await this.httpService.post(finalUrl, lxcContainerRequest);

        if(response.code != 200)
            return null;

        return {
            upid : response.getBody()['data']
        };
    }
}

function nth_occurrence (string, char, nth) {
    var first_index = string.indexOf(char);
    var length_up_to_first_index = first_index + 1;

    if (nth == 1) {
        return first_index;
    } else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = nth_occurrence(string_after_first_occurrence, char, nth - 1);

        if (next_occurrence === -1) {
            return -1;
        } else {
            return length_up_to_first_index + next_occurrence;
        }
    }
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}