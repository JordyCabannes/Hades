"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
/*
    Note : Il faut MongoDB version 3.2 pour que ça marche.
    Pour checker sa version : mongo --version
    Pour installer, utiliser ces lignes de commande :
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
    echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
    sudo apt-get update
    sudo apt-get install mongodb-org
    mongo --version
*/
class DBManager {
    constructor() {
        this.url = 'mongodb://localhost:27017/hades';
    }
    /*Fonction générique pour insérer un document dans une collection*/
    insert_mongodb(table, data) {
        var insertDocument = function (db, callback) {
            db.collection(table).insertOne(data, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the " + table + " collection.");
                callback();
            });
        };
        MongoClient.connect(this.url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db, function () {
                db.close();
            });
        });
    }
    /*Ajouter un user*/
    ajouter_user(login, password, userType) {
        var data = {
            "login": login,
            "password": password,
            "typeofUser": userType,
            "money": 0.0,
            "date_joined": new Date(),
            "last_billed": new Date(),
            "owned_vms": []
        };
        this.insert_mongodb('users', data);
    }
    /*Associer une VM à un user*/
    ajouter_vm_a_user(login, node, proxmox_vmid, dedicated, flavorname) {
        return __awaiter(this, void 0, void 0, function* () {
            var ajouter_vm = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var now = new Date();
                    var fbr = this.get_flavor_billing_rate(flavorname);
                    var vm = yield db.collection('vms').insertOne({
                        'proxmox_id': proxmox_vmid,
                        'node': node,
                        'is_dedicated': dedicated,
                        'owner': login,
                        'date_created': now,
                        'date_deleted': null,
                        'flavor_history': [
                            {
                                'date_from': now,
                                'date_to': null,
                                'flavorname': flavorname,
                                'flavor_billing_rate': fbr
                            }
                        ]
                    });
                    var res = yield db.collection('users').update({ "login": login }, { $addToSet: { 'owned_vms': vm.insertedId } });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield ajouter_vm(db);
            db.close();
            return result;
        });
    }
    /*OBSOLETE, laissé pour compatibiloté avec le reste du code*/
    old_ajouter_vm_a_user(login, proxmox_vmid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fonction obsolète');
            var ajouter_vm = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var now = new Date();
                    var fbr = 0.257;
                    var vm = yield db.collection('vms').insertOne({
                        'proxmox_id': proxmox_vmid,
                        'node': "node",
                        'is_dedicated': "dedicated",
                        'owner': login,
                        'date_created': now,
                        'date_deleted': null,
                        'flavor_history': [
                            {
                                'date_from': now,
                                'date_to': null,
                                'flavorname': "flavorname",
                                'flavor_billing_rate': fbr
                            }
                        ]
                    });
                    var res = yield db.collection('users').update({ "login": login }, { $addToSet: { 'owned_vms': vm.insertedId } });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield ajouter_vm(db);
            db.close();
            return result;
        });
    }
    /*Ajouter ou enlever de l'argent à un user (mettre un nombre positif ou négatif)*/
    add_money_to_user(login, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            var ajouter_vm = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('users').update({ "login": login }, { "$inc": { 'money': amount } });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield ajouter_vm(db);
            db.close();
            return result;
        });
    }
    /*Liste toutes les VMs d'un user (celles actives ET celles supprimées)*/
    list_all_vms_user(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var lister_vms_user = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('vms').find({ "owner": username }, { "_id": 0, "flavor_history": 0 }).toArray();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield lister_vms_user(db);
            db.close();
            return result;
        });
    }
    /*Liste toutes les VMs actuellement en existence d'un user*/
    list_all_active_vms_user(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var lister_vms_user = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('vms').find({ "owner": username,
                        "date_deleted": null }, { "_id": 0, "flavor_history": 0 }).toArray();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield lister_vms_user(db);
            db.close();
            return result;
        });
    }
    /*Liste toutes les VMs précédemment suppérimées d'un user (on les garde pour que la facturation fonctionne)*/
    list_all_deleted_vms_user(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var lister_vms_user = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('vms').find({ "owner": username,
                        "date_deleted": { $ne: null } }, { "_id": 0, "flavor_history": 0 }).toArray();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield lister_vms_user(db);
            db.close();
            return result;
        });
    }
    /*Ajoute dans la BDD la mention qu'une VM a été redimensionnée (important pour la facturation)*/
    log_vm_resize(node, proxmox_vmid, new_flavorname) {
        return __awaiter(this, void 0, void 0, function* () {
            var vm_resize = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var now = new Date();
                    var new_billingrate = this.get_flavor_billing_rate("new_flavorname");
                    //On pull vm et on la modifie à la main
                    var vm = yield db.collection('vms').findOne({ 'proxmox_id': proxmox_vmid, 'node': node });
                    vm.flavor_history[vm.flavor_history.length - 1].date_to = now;
                    var dontcare = vm.flavor_history.push({
                        "date_from": now,
                        "date_to": null,
                        "flavorname": new_flavorname,
                        "flavor_billing_rate": new_billingrate
                    });
                    //On push vm dans la BD
                    var res = yield db.collection('vms').update({ 'proxmox_id': proxmox_vmid, 'node': node }, { $set: { 'flavor_history': vm.flavor_history } });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield vm_resize(db);
            db.close();
            return result;
        });
    }
    /*Ajoute dans la BDD la mention qu'une VM a été supprimée*/
    log_vm_delete(node, proxmox_vmid) {
        return __awaiter(this, void 0, void 0, function* () {
            var update_vm_delete = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var now = new Date();
                    //On pull vm et on la modifie à la main
                    var vm = yield db.collection('vms').findOne({ 'proxmox_id': proxmox_vmid, 'node': node });
                    vm.date_deleted = now;
                    vm.flavor_history[vm.flavor_history.length - 1].date_to = now;
                    //On push vm dans la BD
                    var res = yield db.collection('vms').update({ 'proxmox_id': proxmox_vmid, 'node': node }, vm);
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield update_vm_delete(db);
            db.close();
            return result;
        });
    }
    /*Récupère le taux horaire de facturation en fonction du flavor
    Concept de facturation en fonction des flavors inspiré de https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/*/
    get_flavor_billing_rate(flavorname) {
        return __awaiter(this, void 0, void 0, function* () {
            var get_fbr = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('allowed_flavors').findOne({ "name": flavorname }).flavor_billing_rate;
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield get_fbr(db);
            db.close();
            return result;
        });
    }
    /*Dit si un user est Free ou Premium*/
    getTypeOfUser(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            var functiongetuserType = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('users').findOne({ "login": userlogin }).typeofUser;
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield functiongetuserType(db);
            db.close();
            return result;
        });
    }
    /*Liste les NOMS des flavors autorisés*/
    list_flavor_names() {
        return __awaiter(this, void 0, void 0, function* () {
            var lister_noms_flavors = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var clean_name_list = [];
                    var res = yield db.collection('allowed_flavors').find({}, { "_id": 0, "name": 1 }).forEach(function (doc) { clean_name_list.push(doc.name); });
                    return clean_name_list;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield lister_noms_flavors(db);
            db.close();
            return result;
        });
    }
    /*Liste toutes les caractéristiques des flavors autorisés (nom, cpus...)*/
    list_flavors() {
        return __awaiter(this, void 0, void 0, function* () {
            var lister_flavors = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('allowed_flavors').find().toArray();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield lister_flavors(db);
            db.close();
            return result;
        });
    }
    /*Récupère les caractéristiques d'un flavor en ayant son nom*/
    get_flavor_by_name(flavorname) {
        return __awaiter(this, void 0, void 0, function* () {
            var flavor_by_name = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('allowed_flavors').findOne({ "name": flavorname });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield flavor_by_name(db);
            db.close();
            return result;
        });
    }
    /*Compte le nombre de VMs ACTIVES d'un user*/
    countUserNbVM(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            var getNbVMs = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('vms').find({ "owner": userlogin,
                        "date_deleted": null }).count();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var NbVM = yield getNbVMs(db);
            db.close();
            return NbVM;
        });
    }
    /*Associer un backup à un vmid et un user*/
    associateVmBackupToAnUser(login, vmid, backupPath) {
        return __awaiter(this, void 0, void 0, function* () {
            var functionAssociateBackup = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('backups').insert({
                        "owner": login,
                        "vmid": vmid,
                        "backupPath": backupPath
                    });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield functionAssociateBackup(db);
            db.close();
        });
    }
    /*permet de savoir si l'utilisateur avait créé une backup pour la vm vmid*/
    hasBackupAssociateWithVm(login, vmid) {
        return __awaiter(this, void 0, void 0, function* () {
            var functionhasBackup = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('backups').find({ "owner": login, "vmid": vmid }).count();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield functionhasBackup(db);
            db.close();
            return result == 1;
        });
    }
    /*Récupère le path d'un backup*/
    getBackupPath(login, vmid) {
        return __awaiter(this, void 0, void 0, function* () {
            var functionhasBackup = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('backups').find({ "owner": login, "vmid": vmid }, { "_id": 0, "backupPath": 1 }).toArray();
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield functionhasBackup(db);
            db.close();
            return result;
        });
    }
    /*True si la VM est dédiée, False sinon*/
    is_vm_dedicated(node, proxmox_vmid) {
        return __awaiter(this, void 0, void 0, function* () {
            var est_dedie = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('vms').findOne({ "node": node, "proxmox_vmid": proxmox_vmid }).is_dedicated;
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield est_dedie(db);
            db.close();
            return result;
        });
    }
    /*Récupère la dernière date à laquelle un user a été facturé*/
    get_latest_billing_time(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var glbt = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('users').findOne({ "login": username }).last_billed;
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield glbt(db);
            db.close();
            return result;
        });
    }
    /*Calcule le montant de facturation total pour un user sur les billing_period_seconds dernières secondes (typiquement 3600 = 1 heure mais on peut adapter pour démonstration)*/
    get_billing_amount_for_latest_period(username, billing_period_seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            var now = new Date();
            var billing_from = now;
            billing_from.setSeconds(now.getSeconds() - billing_period_seconds);
            var latest_billing_time = yield this.get_latest_billing_time(username);
            var all_histories = [];
            var get_vms_to_bill = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var vms_to_bill = yield db.collection('vms').find({ $and: [
                            { "owner": "test" },
                            { "$or": [
                                    { "date_deleted": null },
                                    { "date_deleted": { "$gte": billing_from } }
                                ] }
                        ] }).toArray();
                    return vms_to_bill;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var vms_to_bill = yield get_vms_to_bill(db);
            db.close();
            //On ne garde que les parties de l'historique sui sont utiles pour le billing pour cette période
            var relevant_histories = [];
            for (var i = 0; i < vms_to_bill.length; i++) {
                var relevant_history = [];
                var flavor_history = vms_to_bill[i].flavor_history;
                for (var j = 0; j < flavor_history.length; j++) {
                    if (flavor_history[j].date_from > billing_from) {
                        relevant_history.push(vms_to_bill[i].flavor_history[j]);
                    }
                }
                relevant_histories.push(relevant_history);
            }
            //On calcule les montants de facturation par vm et on fait la somme
            var billings_for_vms = [];
            for (var i = 0; i < relevant_histories.length; i++) {
                var flavor_history = relevant_histories[i];
                flavor_history.push({ "date_from": now });
                var billing_for_vm = 0;
                for (var j = 0; j < flavor_history.length - 1; j++) {
                    flavor_history[j];
                    var debut = new Date(flavor_history[j].date_from);
                    var fin = new Date(flavor_history[j + 1].date_from);
                    var time_in_flavor = fin.getTime() - debut.getTime();
                    var billing_periods_in_flavor = Math.ceil(time_in_flavor / billing_period_seconds);
                    billing_for_vm += billing_periods_in_flavor * parseFloat(flavor_history[0].flavor_billing_rate);
                }
                billings_for_vms.push(billing_for_vm);
            }
            var sum = billings_for_vms.reduce(function (pv, cv) { return pv + cv; }, 0);
            return sum;
        });
    }
    /*Récupère le montant d'argent que possède l'user*/
    get_user_money(login) {
        return __awaiter(this, void 0, void 0, function* () {
            var get_field_value = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('users').findOne({ "login": login }, { "_id": 0, "money": 1 });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield get_field_value(db);
            db.close();
            return result;
        });
    }
}
exports.DBManager = DBManager;
//# sourceMappingURL=dbManager.js.map