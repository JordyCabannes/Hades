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
const dbManager_1 = require("../services/database/dbManager");
const frameself_service_1 = require("../services/frameself.service");
const proxmox_utils_1 = require("../utils/proxmox.utils");
var frameself = new frameself_service_1.FrameselfService('127.0.0.1', 5000);
const index = express_1.Router();
/*db Manager*/
var db = new dbManager_1.DBManager();
var cors = require('cors');
/* GET home page. */
index.get('/', function (req, res, next) {
    db.ajouter_user("coucou", "prout", "Free");
    db.old_ajouter_vm_a_user('coucou', 130); //changer plus tard pour ajouter_vm_a_user()
    db.associateVmBackupToAnUser("coucou", 130, "/home/zaurelezo");
    console.log("lolilol");
});
index.options('/*', cors());
/* post createVM */
index.post('/createVM', cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("================== request body" + req.body);
        //connection
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
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
                //Note Nicolas : L'user devrait spécifier un Flavor parmi ceux prédéfinis, et on récupère les caractéristiques du flavor dans la BDD. 
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
                    //db.old_ajouter_vm_a_user(req.body.login,ObjectID.id); //changer plus tard pour ajouter_vm_a_user()
                    console.log("--------- creation réussi");
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
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
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
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        if (proxmoxApi == null) {
            res.send({ "Information": "Fail connection server" });
        }
        else {
            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var createBackupResult = yield proxmoxApi.createContainerBackup('ns3060138', req.body.vmid);
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
/*restore backup
TODO: vm doit être éteinte pour pouvoir faire la backup*/
index.post("/restoreBackup", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        if (proxmoxApi == null) {
            res.send({ "Information": "Fail connection server" });
        }
        else {
            var restoreLxcContainer = {
                vmid: 100,
                ostemplate: '/custom/backups/dump/vzdump-lxc-102-2017_01_12-22_43_28.tar.lzo'
            };
            var resHasBackup = yield db.hasBackupAssociateWithVm("coucou", 130);
            if (resHasBackup) {
                //TODO : voir plus tard le field node quand on travaillera sur ovh
                var restoreLxcContainerResult = yield proxmoxApi.restoreLxcContainer('ns3060138', restoreLxcContainer);
                if (restoreLxcContainerResult != null) {
                    res.send({ "Information": "ok" });
                }
                else {
                    res.send({ "Information": "Fail to restore" });
                }
            }
            else {
                res.send({ "Information": "Need to have a backup if want to restore" });
            }
        }
    });
});
index.get("/testFrameself", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        //proxmoxApi.shutdownLxcContainer('ns3060138', 111);
        var ObjectID = yield proxmoxApi.getClusterVmNextId();
        var container = {
            ostemplate: 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
            vmid: ObjectID.id,
            password: 'rototoroot',
            memory: 1024,
        };
        frameself.reportCreateLxcContainer('ns3060138', container);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map