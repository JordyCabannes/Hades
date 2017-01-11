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
const proxmox_api_service_1 = require("./proxmox-api.service");
/**
 * Created by Halim on 09/01/2017.
 */
const PROXMOX_PORT = '8006';
class ProxmoxService {
    constructor(endpoint, node) {
        this.endpoint = `https://${endpoint}:${PROXMOX_PORT}`;
        this.node = node;
    }
    connect(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var httpService = new http_service_1.HttpService(this.endpoint);
            var connectData = {
                password: password,
                username: username
            };
            var response = yield httpService.post('/api2/json/access/ticket', connectData);
            if (response.code != 200)
                return null;
            var body = response.getBody();
            var proxmoxApi = new proxmox_api_service_1.ProxmoxApiService(this.endpoint, this.node, { PVEAuthCookie: body['data']['ticket'] }, body['data']['CSRFPreventionToken']);
            return proxmoxApi;
        });
    }
}
exports.ProxmoxService = ProxmoxService;
//# sourceMappingURL=proxmox.service.js.map