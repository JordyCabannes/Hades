"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const http_service_1 = require("./http.service");
/**
 * Created by Halim on 09/01/2017.
 */
class ProxmoxApiService {
    constructor(endpoint, node, ticket, CSRF) {
        this.endpoint = endpoint;
        this.ticket = ticket;
        this.CSRF = CSRF;
        this.node = node;
        var httpheaders = {
            'Accept': 'application/json',
            'CSRFPreventionToken': this.CSRF
        };
        this.httpService = new http_service_1.HttpService(this.endpoint, httpheaders, this.ticket);
    }
    createLxcContainer(lxcContainerRequest) {
        return __awaiter(this, void 0, Promise, function* () {
            var finalUrl = `/api2/json/nodes/${this.node}/lxc`;
            var response = yield this.httpService.post(finalUrl, lxcContainerRequest);
            if (response.code != 200)
                return null;
            console.log(response);
            return {
                createContainerInformation: response.getBody()['data']
            };
        });
    }
}
exports.ProxmoxApiService = ProxmoxApiService;
//# sourceMappingURL=proxmox-api.service.js.map