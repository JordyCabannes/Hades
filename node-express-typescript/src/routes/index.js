"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const express_1 = require('express');
const proxmox_service_1 = require("../services/proxmox.service");
const dbManager_1 = require("../services/database/dbManager");
var proxApi = null;
function getPromoxApi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (proxApi == null) {
            var proxmox = new proxmox_service_1.ProxmoxService('ip', '/api2/json');
            proxApi = yield proxmox.connect('root@pam', 'password');
        }
        return proxApi;
    });
}
const index = express_1.Router();
/*db Manager*/
var db = new dbManager_1.DBManager();
/* var proxmoxApi = getPromoxApi();
if(proxmoxApi != null) {


/*var cNextVmId = await proxmoxApi.getClusterVmNextId();
var container : ICreateLxcContainerRequest = {
ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
vmid : cNextVmId.id,
password : 'rootroot',
memory:1024
}*/
//var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer('ns3060138', container);
//console.log(result);
/*var a = {
 vmid : 100,
 storage : 'backups',
 compress : BackupCompress.LZO,
 mode : BackupModes.SNAPSHOT
 }
 */
/*var d = {
 vmid : 100,
 ostemplate:'/custom/backups/dump/vzdump-lxc-102-2017_01_12-22_43_28.tar.lzo'
 }

 //var b = await proxmoxApi.createContainerBackup('ns3060138', a);
 var c = await proxmoxApi.restoreLxcContainer('ns3060138', d);
 console.log(c);
 //console.log(b);

 console.log();
 }*/
/* GET home page. */
index.get('/', function (req, res, next) {
    // ajouter_user('coucou', 'blah', UserClass.Free)
    db.ajouter_user("coucou", "prout", "Free");
    db.ajouter_vm_a_user('coucou', 130);
    console.log("lolilol");
});
/* post createVM */
index.post('/createVM', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("request body" + req.body);
        //connection
        var proxmoxApi = yield getPromoxApi();
        //free or premium
        var typeUser = yield db.getTypeOfUser("coucou");
        var numberVM = yield db.countUserNbVM("coucou");
        console.log(".............****************************", typeUser);
        console.log("..............********************************", numberVM);
        if (typeUser == "Free" && numberVM > 0) {
            res.send({ "containerID": -1, "information": "Cannot create more vm" });
        }
        else {
            if (proxmoxApi != null) {
                var ObjectID = yield proxmoxApi.getClusterVmNextId();
                var container = {
                    ostemplate: 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
                    vmid: ObjectID.id,
                    password: req.body.password,
                    memory: req.body.memory,
                };
                var result = yield proxmoxApi.createLxcContainer('ns3060138', container);
                if (result == null) {
                    res.send({ "containerID": -1, "information": "" });
                }
                else {
                    db.ajouter_vm_a_user(req.body.login, ObjectID.id);
                    res.send({ "containerID": ObjectID.id, "information": "" }); //send back vm creation information
                }
            }
            else {
                res.send({ "containerID": -1 });
            }
        }
    });
});
/* monitoring */
index.get("/monitoring", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //connection
        var proxmoxApi = yield getPromoxApi();
        console.log("========================== vmid ", req.body.vmid);
        //voir plus tard le field node quand on travaillera sur ovh 
        var monitoringResult = yield proxmoxApi.getContainerStatus('ns3060138', req.body.vmid);
        console.log("================================", monitoringResult);
        res.send(monitoringResult);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map