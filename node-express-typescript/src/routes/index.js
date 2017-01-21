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
index.options('/*', cors());
/* GET home page. */
index.get('/', function (req, res, next) {
    db.ajouter_user("coucou", "prout", "Free");
    db.old_ajouter_vm_a_user('coucou', 130); //changer plus tard pour ajouter_vm_a_user()
    db.associateVmBackupToAnUser("coucou", 130, "/home/zaurelezo");
    console.log("lolilol");
});
index.get("/User/:login", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield db.get_user(req.params.login);
        if (user) {
            //res.send({"login":user.login,"password":user.password, "typeofUser":user.typeofUser});
            res.send({ "user": user[0] });
        }
        else {
            res.send({ "User": "ko", "Information": "ko" });
        }
    });
});
/*add user account*/
index.post("/createAccount", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var resHasAccount = yield db.hasAnAccount(req.body.login, req.body.password);
        if (!resHasAccount) {
            db.ajouter_user(req.body.login, req.body.password, req.body.typeofUser);
            res.send({ "addUser": "ok", "Information": "Account created" });
        }
        else {
            res.send({ "addUser": "ko", "Information": "Already has an account" });
        }
    });
});
index.get("/UserVMs/:login", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var listVM = yield db.list_all_vms_user(req.params.login);
        res.send({ "listVM": listVM });
    });
});
index.get("/VM/:id", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var VM = yield db.getVm(req.params.id);
        res.send({ "VM": VM[0] });
    });
});
/*sign in*/
index.post("/signIn", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("valeur de login" + req.params.login);
        console.log("valeur de password" + req.params.password);
        var resHasAccount = yield db.hasAnAccount(req.body.login, req.body.password);
        if (resHasAccount) {
            res.send({ "signIn": "ok", "Information": "ok" });
        }
        else {
            res.send({ "signIn": "ko", "Information": "Wrong login or password" });
        }
    });
});
/* post createVM */
index.post('/createVM', cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("================== request body" + req.body);
        //connection
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        //free or premium
        var typeUser = yield db.getTypeOfUser(req.body.login);
        var numberVM = yield db.countUserNbVM(req.body.login);
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
                    memory: req.body.memory
                };
                //TODO : voir plus tard le field node quand on travaillera sur ovh
                var result = yield proxmoxApi.createLxcContainer(proxmoxApi.node, container);
                if (result == null) {
                    res.send({ "containerID": -1, "Information": "Fail create vm" });
                }
                else {
                    //db.old_ajouter_vm_a_user(req.body.login,ObjectID.id); //changer plus tard pour ajouter_vm_a_user()
                    //console.log("--------- creation réussi")
                    var resAdd = db.ajouter_vm_a_user(req.body.login, proxmoxApi.node, ObjectID.id, false, req.body.login + ObjectID.id.toString());
                    //db.old_ajouter_vm_a_user(req.body.login,ObjectID.id); //changer plus tard pour ajouter_vm_a_user()
                    console.log("------ " + resAdd);
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
            var monitoringResult = yield proxmoxApi.getContainerStatus(proxmoxApi.node, req.params.vmid);
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
index.get("/createBackup/:id", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //connection
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        if (proxmoxApi == null) {
            res.send({ "Information": "Fail connection server" });
        }
        else {
            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var createBackupResult = yield proxmoxApi.createContainerBackup(proxmoxApi.node, req.params.id);
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
                var restoreLxcContainerResult = yield proxmoxApi.restoreLxcContainer(proxmoxApi.node, restoreLxcContainer);
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
        var ObjectID = yield proxmoxApi.getClusterVmNextId();
        var container = {
            ostemplate: 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
            vmid: 100,
            password: 'tototo',
            memory: 1024,
            sizeGB: 1
        };
        var result = yield proxmoxApi.createLxcContainer(proxmoxApi.node, container);
        if (result == null)
            frameself.reportCreateLxcContainer(proxmoxApi.node, container);
    });
});
/*startVM: start un container*/
index.get("/startVM/:id", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //connection
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        if (proxmoxApi == null) {
            res.send({ "Information": "Fail connection server" });
        }
        else {
            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var startVMResult = yield proxmoxApi.startLxcContainer(proxmoxApi.node, req.params.id);
            if (startVMResult == null) {
                res.send({ "Information": "Fail start Vm" });
            }
            else {
                res.send({ "Information": "ok" });
            }
        }
    });
});
/*stopVM: arrête un container*/
index.get("/stopVM/:id", cors(), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //connection
        var proxmoxApi = yield proxmox_utils_1.ProxmoxUtils.getPromoxApi();
        if (proxmoxApi == null) {
            res.send({ "Information": "Fail connection server" });
        }
        else {
            var stopVMResult = yield proxmoxApi.stopLxcContainer(proxmoxApi.node, req.params.id);
            if (stopVMResult == null) {
                res.send({ "Information": "Fail stop Vm" });
            }
            else {
                res.send({ "Information": "ok" });
            }
        }
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map