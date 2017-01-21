import {Socket} from "dgram";
import {UdpService} from "../services/udp.service";
import {IFrameselfAction} from "../interfaces/frameself-action.interface";
import {ProxmoxUtils} from "../utils/proxmox.utils";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxApiService} from "../services/proxmox-api.service";
/**
 * Created by Halim on 14/01/2017.
 */

var dgram = require('dgram');

export class FrameselfDispatcher {

    private udpSocket : Socket;
    private host : string;
    private listenPort : number;
    private sendPort : number;
    private udpService : UdpService;

    constructor(host : string, listenPort : number, sendPort : number)
    {
        this.host = host;
        this.listenPort = listenPort;
        this.sendPort = sendPort;
        this.udpService = new UdpService(host, this.sendPort);
    }

    public startServer()
    {
        this.udpSocket = dgram.createSocket('udp4');
        this.udpSocket.on('listening', function () {
            var uaddress = this.udpSocket.address();
            console.log('Frameself dispatcher listening on ' + uaddress.address + ":" + uaddress.port);
        }.bind(this));

        this.udpSocket.on('message', async function (action, remote) {
            await this.dispatchAction(JSON.parse(action));
        }.bind(this));

        this.udpSocket.bind(this.listenPort, this.host);
    }

    protected async dispatchAction(action : IFrameselfAction)
    {
        var data = null;
        if(action.attributes.length > 0)
            data = JSON.parse(action.attributes[0].value);

        var proxmoxApi : ProxmoxApiService = null;

        if(action.category == "CREATE_CONTAINER_ACTION")
        {
            if(data['node'] = 'ns3060138') //ovh1
            {
                data.ostemplate = 'local:vztmpl/debian-8.0-standard_8.6-1_amd64.tar.gz';//alors ovh2
                proxmoxApi = await ProxmoxUtils.getPromoxApi2();
            }
            else
            {
                data.ostemplate = 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz';
                proxmoxApi = await ProxmoxUtils.getPromoxApi();
            }
            delete data['node'];

            var ObjectID  :IGetClusterVmNextIdReply = await proxmoxApi.getClusterVmNextId();
            data.vmid = ObjectID.id;

            var result = await proxmoxApi.createLxcContainer(proxmoxApi.node, data);

            if(result == null)
                action.result = 'FAILURE';
            else
                action.result = "SUCCESS";

            this.udpService.send(action);
        }


    }
}
