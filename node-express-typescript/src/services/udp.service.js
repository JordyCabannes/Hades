/**
 * Created by Halim on 14/01/2017.
 */
"use strict";
var dgram = require('dgram');
class UdpService {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    send(data) {
        var client = dgram.createSocket('udp4');
        var message = new Buffer(JSON.stringify(data));
        client.send(message, 0, message.length, this.port, this.host, function (err, bytes) {
            if (err)
                console.error(err);
            else
                console.log('UDP message sent to ' + this.host + ':' + this.port + ' with ' + bytes + ' bytes.');
            client.close();
        }.bind(this));
    }
}
exports.UdpService = UdpService;
//# sourceMappingURL=udp.service.js.map