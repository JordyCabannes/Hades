/**
 * Created by Halim on 14/01/2017.
 */

var dgram = require('dgram');

export class UdpService {

    private host : string;
    private port : number;

    constructor(host : string, port : number)
    {
        this.host = host;
        this.port = port;
    }

    public send(data:{[id:string]:any;})
    {
        var client = dgram.createSocket('udp4');
        var message = new Buffer(JSON.stringify(data));
        client.send(message, 0, message.length, this.port, this.host, function (err, bytes) {

            if (err)
                console.error(err);
            else
                console.log('UDP message sent to ' + this.host +':'+ this.port + ' with ' + bytes + ' bytes.');

            client.close();
        }.bind(this));
    }
}