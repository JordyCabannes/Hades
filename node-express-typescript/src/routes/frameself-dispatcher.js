"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const udp_service_1 = require("../services/udp.service");
const proxmox_utils_1 = require("../utils/proxmox.utils");
/**
 * Created by Halim on 14/01/2017.
 */
var dgram = require('dgram');
class FrameselfDispatcher {
    constructor(host, listenPort, sendPort) {
        this.host = host;
        this.listenPort = listenPort;
        this.sendPort = sendPort;
        this.udpService = new udp_service_1.UdpService(host, this.sendPort);
    }
    startServer() {
        this.udpSocket = dgram.createSocket('udp4');
        this.udpSocket.on('listening', function () {
            var uaddress = this.udpSocket.address();
            console.log('Frameself dispatcher listening on ' + uaddress.address + ":" + uaddress.port);
        }.bind(this));
        this.udpSocket.on('message', function (action, remote) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.dispatchAction(JSON.parse(action));
            });
        }.bind(this));
        this.udpSocket.bind(this.listenPort, this.host);
    }
    dispatchAction(action) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = null;
            if (action.attributes.length > 0)
                data = JSON.parse(action.attributes[0].value);
            console.log(data);
            var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
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
        });
    }
}
exports.FrameselfDispatcher = FrameselfDispatcher;
//# sourceMappingURL=frameself-dispatcher.js.map