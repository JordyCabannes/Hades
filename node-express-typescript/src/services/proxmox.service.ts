import {HttpService} from "./http.service";
import {ProxmoxApiService} from "./proxmox-api.service";

/**
 * Created by Halim on 09/01/2017.
 */

const PROXMOX_PORT : string = '8006';

export class ProxmoxService
{
    private endpoint : string;
    private node : string;
    constructor(endpoint : string, node : string)
    {
        this.endpoint =  `https://${endpoint}:${PROXMOX_PORT}`;
        this.node = node;
    }

    public async connect(username, password)
    {
        var httpService = new HttpService(this.endpoint);
        var connectData = {
            password : password,
            username : username
        };

        var response = await httpService.post('/api2/json/access/ticket', connectData);

        if(response.code != 200)
            return null;

        var body = response.getBody();
        var proxmoxApi = new ProxmoxApiService(this.endpoint, this.node, {PVEAuthCookie: body['data']['ticket']}, body['data']['CSRFPreventionToken'])
        return proxmoxApi;
    }
}