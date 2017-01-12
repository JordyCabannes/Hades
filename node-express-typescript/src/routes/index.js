"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express_1 = require("express");
const proxmox_service_1 = require("../services/proxmox.service");
const dbManager_1 = require("../services/database/dbManager");
const index = express_1.Router();
/* GET home page. */
index.get('/', function (req, res, next) {
    // ajouter_user('coucou', 'blah', UserClass.Free)
    var db = new dbManager_1.DBManager();
    db.ajouter_user("coucou", "prout", "toto");
    db.ajouter_vm_a_user('coucou', 130);
    console.log("lolilol");
});
/* GET Quick Start. */
index.post('/createVM', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        var container = {
            ostemplate: 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
            vmid: 11251,
            password: req.body.password,
            memory: req.body.memory
        };
        var proxmox = new proxmox_service_1.ProxmoxService('213.32.27.237', '/api2/json');
        var proxmoxApi = yield proxmox.connect('root@pam', 'dshTYjUrW6CA');
        if (proxmoxApi != null) {
            console.log(" connection object " + proxmoxApi);
            var result = yield proxmoxApi.createLxcContainer(container);
            res.send(result); //send back vm creation information
        }
        //error 
        res.send({});
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map