import {HttpService} from "./http.service";
import {ProxmoxApiService} from "./proxmox-api.service";
import {UdpService} from "./udp.service";
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {FrameselfUtils} from "../utils/frameself.utils";

/**
 * Created by Halim on 09/01/2017.
 */

export class FrameselfService
{
    private udpService : UdpService;

    constructor(host : string, port : number)
    {
        this.udpService = new UdpService(host, port);
    }

    public reportCreateLxcContainer(node : string, lxcContainerRequest : ICreateLxcContainerRequest)
    {
        var data : {[id:string]:any;} = lxcContainerRequest;
        data['node'] = node;
        var frameselfEvent = FrameselfUtils.generateFrameselfEvent("CREATE_CONTAINER_FAILED", data);
        this.udpService.send(frameselfEvent);
    }
}