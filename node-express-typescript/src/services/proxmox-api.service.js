"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const http_service_1 = require("./http.service");
/**
 * Created by Halim on 09/01/2017.
 */
class ProxmoxApiService {
    constructor(endpoint, ticket, CSRF) {
        this.endpoint = endpoint;
        this.ticket = ticket;
        this.CSRF = CSRF;
        var httpheaders = {
            'Accept': 'application/json',
            'CSRFPreventionToken': this.CSRF
        };
        this.httpService = new http_service_1.HttpService(this.endpoint, httpheaders, this.ticket);
    }
    /* public async createContainerBackup(createContainerBackupRequest : ICreateContainerBackupRequest)
     {
         var finalUrl = '/cluster/backup';
         var response = await this.httpService.post(finalUrl, createContainerBackupRequest);
         console.log(response);
         if(response.code != 200)
             return null;
     }*/
    getContainerStatus(node, vmid) {
        return __awaiter(this, void 0, void 0, function* () {
            var finalUrl = `/nodes/${node}/lxc/${vmid}/status/current`;
            var response = yield this.httpService.get(finalUrl);
            if (response.code != 200)
                return null;
            var body = response.getBody()['data'];
            return body;
        });
    }
    getClusterVmNextId() {
        return __awaiter(this, void 0, void 0, function* () {
            var finalUrl = `/cluster/nextid`;
            var response = yield this.httpService.get(finalUrl);
            if (response.code != 200)
                return null;
            var id = +response.getBody()['data'];
            return {
                id: id
            };
        });
    }
    createLxcContainer(node, lxcContainerRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            var finalUrl = `/nodes/${node}/lxc`;
            var response = yield this.httpService.post(finalUrl, lxcContainerRequest);
            if (response.code != 200)
                return null;
            return {
                upid: response.getBody()['data']
            };
        });
    }
}
exports.ProxmoxApiService = ProxmoxApiService;
//# sourceMappingURL=proxmox-api.service.js.map