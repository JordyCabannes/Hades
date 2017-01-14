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
    /*vm doit être éteinte pour pouvoir faire la backup*/
    restoreLxcContainer(node, restoreLxcContainerRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            var finalUrl = `/nodes/${node}/lxc`;
            restoreLxcContainerRequest['restore'] = 1;
            restoreLxcContainerRequest['force'] = 1;
            var response = yield this.httpService.post(finalUrl, restoreLxcContainerRequest);
            if (response.code != 200)
                return null;
            return {
                upid: response.getBody()['data']
            };
        });
    }
    createContainerBackup(node, createContainerBackupRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            var finalUrl = `/nodes/${node}/vzdump`;
            var response = yield this.httpService.post(finalUrl, createContainerBackupRequest);
            if (response.code != 200)
                return null;
            var upid = response.getBody()['data'];
            var iBegin = nth_occurrence(upid, ':', 4) + 1;
            var iEnd = nth_occurrence(upid, ':', 5);
            var hexTimestamp = upid.substring(iBegin, iEnd);
            var timestamp = parseInt(hexTimestamp, 16);
            var date = new Date(timestamp * 1000);
            var vmid = createContainerBackupRequest.vmid;
            var storage = createContainerBackupRequest.storage;
            var year = leftPad(date.getUTCFullYear(), 4);
            var month = leftPad(date.getUTCMonth() + 1, 2);
            var day = leftPad(date.getUTCDate(), 2);
            var hours = leftPad(date.getHours(), 2);
            var minutes = leftPad(date.getMinutes(), 2);
            var seconds = leftPad(date.getSeconds(), 2);
            var backup = `/custom/backups/dump/vzdump-lxc-${vmid}-${year}_${month}_${day}-${hours}_${minutes}_${seconds}.tar.lzo`;
            return {
                upid: upid,
                backup: backup
            };
        });
    }
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
function nth_occurrence(string, char, nth) {
    var first_index = string.indexOf(char);
    var length_up_to_first_index = first_index + 1;
    if (nth == 1) {
        return first_index;
    }
    else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = nth_occurrence(string_after_first_occurrence, char, nth - 1);
        if (next_occurrence === -1) {
            return -1;
        }
        else {
            return length_up_to_first_index + next_occurrence;
        }
    }
}
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
//# sourceMappingURL=proxmox-api.service.js.map