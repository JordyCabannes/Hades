import {HttpService} from "./http.service";
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";

/**
 * Created by Halim on 09/01/2017.
 */

export class ProxmoxApiService
{
    private httpService : HttpService;
    private endpoint : string;
    private CSRF : string;
    private ticket : {[id:string]:any;};
    private node : string;

    constructor(endpoint : string, node : string, ticket : {[id:string]:any;}, CSRF : string)
    {
        this.endpoint =  endpoint;
        this.ticket = ticket;
        this.CSRF = CSRF;
        this.node = node;

        var httpheaders = {
            'Accept':'application/json',
            'CSRFPreventionToken':this.CSRF
        };

        this.httpService = new HttpService(this.endpoint, httpheaders, this.ticket);
    }

    public async createLxcContainer(lxcContainerRequest : ICreateLxcContainerRequest) : Promise<ICreateLxcContainerReply>
    {
        var finalUrl = `/api2/json/nodes/${this.node}/lxc`;
        var response = await this.httpService.post(finalUrl, lxcContainerRequest);

        if(response.code != 200)
            return null;

        console.log(response);
        return {
            createContainerInformation : response.getBody()['data']
        };
    }
}