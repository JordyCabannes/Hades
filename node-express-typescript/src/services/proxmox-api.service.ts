
import {HttpService} from "./http.service";
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";
import {IGetContainerStatusReply} from "../interfaces/get-container-status-reply.interface";
import {
    ICreateContainerBackupRequest, BackupCompress,
    BackupModes
} from "../interfaces/create-container-backup-request";
import {ICreateContainerBackupReply} from "../interfaces/create-container-backup-reply.interface";
import {IRestoreLxcContainerRequest} from "../interfaces/restore-lxc-container-request.interface";
import {ProxmoxApiUtils} from "../utils/proxmox-api.utils";
import {IUpidReply} from "../interfaces/upid-reply.interface";

/**
 * Created by Halim on 09/01/2017.
 */

export class ProxmoxApiService
{
    private httpService : HttpService;
    private endpoint : string;
    private CSRF : string;
    private ticket : {[id:string]:any;};
    private _node : string;

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

    public set node(value : string)
    {
        this._node = value;
    }

    public get node()
    {
        return this._node;
    }

    public async restoreLxcContainer(node : string, restoreLxcContainerRequest : IRestoreLxcContainerRequest) : Promise<IUpidReply>
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

    public async createContainerBackup(node : string, vmid:number) : Promise<ICreateContainerBackupReply>
    {
        var finalUrl = `/nodes/${node}/vzdump`;

        var createContainerBackupRequest : ICreateContainerBackupRequest = {
            vmid : vmid,
            storage : 'backups',
            compress : BackupCompress.LZO,
            mode : BackupModes.SNAPSHOT
        };

        var response = await this.httpService.post(finalUrl, createContainerBackupRequest);

        if(response.code != 200)
            return null;

        var upid : string = response.getBody()['data'];
        var iBegin = ProxmoxApiUtils.nth_occurrence(upid, ':', 4) + 1;
        var iEnd = ProxmoxApiUtils.nth_occurrence(upid, ':', 5);
        var hexTimestamp = upid.substring(iBegin, iEnd);
        var timestamp = parseInt(hexTimestamp, 16);
        var date = new Date(timestamp*1000);
        var year = ProxmoxApiUtils.leftPad(date.getUTCFullYear(), 4);
        var month = ProxmoxApiUtils.leftPad(date.getUTCMonth() + 1, 2);
        var day = ProxmoxApiUtils.leftPad(date.getUTCDate(), 2);
        var hours = ProxmoxApiUtils.leftPad(date.getHours(), 2);
        var minutes = ProxmoxApiUtils.leftPad(date.getMinutes(), 2);
        var seconds = ProxmoxApiUtils.leftPad(date.getSeconds(), 2);

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

    public async startLxcContainer(node : string, vmid : number) : Promise<IUpidReply>
    {
        var finalUrl = `/nodes/${node}/lxc/${vmid}/status/start`;
        var response = await this.httpService.post(finalUrl, {});

        if(response.code != 200)
            return null;

        return {
            upid : response.getBody()['data']
        };
    }

    public async stopLxcContainer(node : string, vmid : number) : Promise<IUpidReply>
    {
        var finalUrl = `/nodes/${node}/lxc/${vmid}/status/stop`;
        var response = await this.httpService.post(finalUrl, {});

        if(response.code != 200)
            return null;

        return {
            upid : response.getBody()['data']
        };
    }

    public async shutdownLxcContainer(node : string, vmid : number) : Promise<IUpidReply>
    {
        var finalUrl = `/nodes/${node}/lxc/${vmid}/status/shutdown`;
        var response = await this.httpService.post(finalUrl, {});

        if(response.code != 200)
            return null;

        return {
            upid : response.getBody()['data']
        };
    }

    public async createLxcContainer(node : string, lxcContainerRequest : ICreateLxcContainerRequest) : Promise<IUpidReply>
    {
        var finalUrl = `/nodes/${node}/lxc`;
        var body : {[id:string]:any;} = lxcContainerRequest;
        if(body.hasOwnProperty('sizeGB'))
        {
            body['rootfs'] = 'local:' + body['sizeGB'];
            delete body['sizeGB'];
        }
        var response = await this.httpService.post(finalUrl, lxcContainerRequest);

        if(response.code != 200)
            return null;

        return {
            upid : response.getBody()['data']
        };
    }
}