"use strict";
const udp_service_1 = require("./udp.service");
const frameself_utils_1 = require("../utils/frameself.utils");
/**
 * Created by Halim on 09/01/2017.
 */
class FrameselfService {
    constructor(host, port) {
        this.udpService = new udp_service_1.UdpService(host, port);
    }
    reportCreateLxcContainer(node, lxcContainerRequest) {
        var data = lxcContainerRequest;
        data['node'] = node;
        var frameselfEvent = frameself_utils_1.FrameselfUtils.generateFrameselfEvent("CREATE_CONTAINER_FAILED", data);
        this.udpService.send(frameselfEvent);
    }
}
exports.FrameselfService = FrameselfService;
//# sourceMappingURL=frameself.service.js.map