import {Socket} from "dgram";
import {UdpService} from "../services/udp.service";
import {IFrameselfAction} from "../interfaces/frameself-action.interface";
import {ProxmoxUtils} from "../utils/proxmox.utils";
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

        console.log(data);
        var proxmoxApi = await ProxmoxUtils.getPromoxApi();

        /*
            if(action.category == "CREATE")
            {
                proxmoxApi.createLxcContainer(...);
            }
            else if(...)
            {
                ...
            }
        */

        this.udpService.send(action);
    }
}



