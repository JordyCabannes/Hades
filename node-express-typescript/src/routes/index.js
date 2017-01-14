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
const create_container_backup_request_1 = require("../interfaces/create-container-backup-request");
var proxApi = null;
function getPromoxApi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (proxApi == null) {
            var proxmox = new proxmox_service_1.ProxmoxService('213.32.27.237', '/api2/json');
            proxApi = yield proxmox.connect('root@pam', 'dshTYjUrW6CA');
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
            res.send({ "containerID": -1, "Information": "Cannot create more vm" });
        }
        else {
            if (proxmoxApi != null) {
                var ObjectID = yield proxmoxApi.getClusterVmNextId();
                //TODO: gérer plus tard  le fait que l'user premium doit spécifier le nb de coeur
                var container = {
                    ostemplate: 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
                    vmid: ObjectID.id,
                    password: req.body.password,
                    memory: req.body.memory,
                };
                //TODO : voir plus tard le field node quand on travaillera sur ovh
                var result = yield proxmoxApi.createLxcContainer('ns3060138', container);
                if (result == null) {
                    res.send({ "containerID": -1, "Information": "Fail create vm" });
                }
                else {
                    db.ajouter_vm_a_user(req.body.login, ObjectID.id);
                    res.send({ "containerID": ObjectID.id, "Information": "ok" }); //send back vm creation information
                }
            }
            else {
                res.send({ "containerID": -1, "Information": "Fail connection server" });
            }
        }
    });
});
/* monitoring */
index.get("/monitoring/:vmid", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //connection
        var proxmoxApi = yield getPromoxApi();
        if (proxmoxApi != null) {
            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var monitoringResult = yield proxmoxApi.getContainerStatus('ns3060138', req.params.vmid);
            if (monitoringResult == null) {
                res.send({ "Information": "Fail get monitoring informations" });
            }
            else {
                monitoringResult["Information"] = "ok";
                res.send(monitoringResult);
            }
        }
        else {
            res.send({ "Information": "Fail connection server" });
        }
    });
});
/*createBackup
théoriquement on peu plusieurs backups, mais on va se limiter à une backup pour le projet*/
index.post("/createBackup", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //connection
        var proxmoxApi = yield getPromoxApi();
        if (proxmoxApi == null) {
            res.send({ "Information": "Fail connection server" });
        }
        else {
            var backupRequest = {
                vmid: req.body.vmid,
                storage: 'backups',
                compress: create_container_backup_request_1.BackupCompress.LZO,
                mode: create_container_backup_request_1.BackupModes.SNAPSHOT
            };
            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var createBackupResult = yield proxmoxApi.createContainerBackup('ns3060138', backupRequest);
            if (createBackupResult == null) {
                res.send({ "Information": "Fail create backup" });
            }
            else {
                //sauvegarde de la backup dans la bdd
                db.associateVmBackupToAnUser(req.body.login, req.body.vmid, createBackupResult[" backup"]);
                res.send({ "Information": "ok" });
            }
        }
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map