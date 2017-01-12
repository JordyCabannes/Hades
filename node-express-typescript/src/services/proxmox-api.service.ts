import {HttpService} from "./http.service";
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";
import {IGetContainerStatusReply} from "../interfaces/get-container-status-reply.interface";
import {ICreateContainerBackupRequest} from "../interfaces/create-container-backup-request";

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

   /* public async createContainerBackup(createContainerBackupRequest : ICreateContainerBackupRequest)
    {
        var finalUrl = '/cluster/backup';
        var response = await this.httpService.post(finalUrl, createContainerBackupRequest);
        console.log(response);
        if(response.code != 200)
            return null;
    }*/

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