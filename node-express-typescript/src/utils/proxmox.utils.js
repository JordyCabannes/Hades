"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const proxmox_service_1 = require("../services/proxmox.service");
/**
 * Created by Halim on 14/01/2017.
 */
class ProxmoxUtils {
    static getPromoxApi() {
        return __awaiter(this, void 0, void 0, function* () {
            if (ProxmoxUtils.proxApi == null) {
                var proxmox = new proxmox_service_1.ProxmoxService('213.32.27.237', '/api2/json');
                ProxmoxUtils.proxApi = yield proxmox.connect('root@pam', '5po9LDo7Wnvg');
                if (ProxmoxUtils.proxApi != null)
                    ProxmoxUtils.proxApi.node = 'ns3060138';
            }
            return ProxmoxUtils.proxApi;
        });
    }
    static getPromoxApi2() {
        return __awaiter(this, void 0, void 0, function* () {
            if (ProxmoxUtils.proxApi == null) {
                var proxmox = new proxmox_service_1.ProxmoxService('ip', '/api2/json');
                ProxmoxUtils.proxApi = yield proxmox.connect('root@pam', 'password');
                if (ProxmoxUtils.proxApi != null)
                    ProxmoxUtils.proxApi.node = 'ns3019351';
            }
            return ProxmoxUtils.proxApi;
        });
    }
}
ProxmoxUtils.proxApi = null;
exports.ProxmoxUtils = ProxmoxUtils;
//# sourceMappingURL=proxmox.utils.js.map