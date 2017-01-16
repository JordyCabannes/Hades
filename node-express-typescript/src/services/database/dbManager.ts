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

export class DBManager  
{
    private url: string;

    public constructor() {
        this.url = 'mongodb://localhost:27017/hades';
    }

    /*Fonction générique pour insérer un document dans une collection*/
    public insert_mongodb(table: string, data: any) {
        var insertDocument = function(db, callback) {
            db.collection(table).insertOne(data, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the "+table+" collection.");
                callback();
            });
        };

        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
                db.close();
            });
        });
    }

    /*Ajouter un user*/
    public ajouter_user(login: string, password: string, userType: string) {

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
    public async ajouter_vm_a_user(login: string, node: string, proxmox_vmid: number, dedicated: boolean, flavorname: string): Promise<string> {
        var ajouter_vm = async function(db) {
            var now = new Date();
            var fbr = this.get_flavor_billing_rate(flavorname);
            var vm = await db.collection('vms').insertOne({
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
            var res = await db.collection('users').update(
               {"login": login},
               {$addToSet: {'owned_vms': vm.insertedId}});
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await ajouter_vm(db);
        db.close();
        return result;
    }

    /*OBSOLETE, laissé pour compatibiloté avec le reste du code*/
    public async old_ajouter_vm_a_user(login: string, proxmox_vmid: number): Promise<string> {
        console.log('Fonction obsolète')
        var ajouter_vm = async function(db) {
            var now = new Date();
            var fbr = 0.257;
            var vm = await db.collection('vms').insertOne({
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
            var res = await db.collection('users').update(
               {"login": login},
               {$addToSet: {'owned_vms': vm.insertedId}});
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await ajouter_vm(db);
        db.close();
        return result;
    }


    /*Ajouter ou enlever de l'argent à un user (mettre un nombre positif ou négatif)*/
    public async add_money_to_user(login: string, amount: number): Promise<string> {
        var ajouter_vm = async function(db) {
            var res = await db.collection('users').update(
               {"login": login},
               {"$inc": {'money': amount}});
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await ajouter_vm(db);
        db.close();
        return result;
    }

    /*Liste toutes les VMs d'un user (celles actives ET celles supprimées)*/
    public async list_all_vms_user(username: string) {
        var lister_vms_user = async function(db) {
            var res = await db.collection('vms').find(
                {"owner": username},
                {"_id": 0, "flavor_history": 0}
            ).toArray();
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await lister_vms_user(db);
        db.close();
        return result;
    }

    /*Liste toutes les VMs actuellement en existence d'un user*/
    public async list_all_active_vms_user(username: string) {
        var lister_vms_user = async function(db) {
            var res = await db.collection('vms').find(
                {"owner": username, 
                "date_deleted": null},
                {"_id": 0, "flavor_history": 0}
            ).toArray();
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await lister_vms_user(db);
        db.close();
        return result;
    }

    /*Liste toutes les VMs précédemment suppérimées d'un user (on les garde pour que la facturation fonctionne)*/
    public async list_all_deleted_vms_user(username: string) {
        var lister_vms_user = async function(db) {
            var res = await db.collection('vms').find(
                {"owner": username,
                "date_deleted": {$ne: null}},
                {"_id": 0, "flavor_history": 0}
            ).toArray();
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await lister_vms_user(db);
        db.close();
        return result;
    }

    /*Ajoute dans la BDD la mention qu'une VM a été redimensionnée (important pour la facturation)*/
    public async log_vm_resize(node: string, proxmox_vmid: number, new_flavorname: string) {
        var vm_resize = async function(db) {
            var now = new Date();
            var new_billingrate = this.get_flavor_billing_rate("new_flavorname");

            //On pull vm et on la modifie à la main
            var vm = await db.collection('vms').findOne({'proxmox_id': proxmox_vmid, 'node': node});
            vm.flavor_history[vm.flavor_history.length-1].date_to = now;
            var dontcare = vm.flavor_history.push({
                "date_from": now,
                "date_to": null,
                "flavorname": new_flavorname,
                "flavor_billing_rate": new_billingrate
            });

            //On push vm dans la BD
            var res = await db.collection('vms').update(
               {'proxmox_id': proxmox_vmid, 'node': node},
               {$set: {'flavor_history': vm.flavor_history}});
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await vm_resize(db);
        db.close();
        return result;
    }

    /*Ajoute dans la BDD la mention qu'une VM a été supprimée*/
    public async log_vm_delete(node: string, proxmox_vmid: number) {
        var update_vm_delete = async function(db) {
            var now = new Date();

            //On pull vm et on la modifie à la main
            var vm = await db.collection('vms').findOne({'proxmox_id': proxmox_vmid, 'node': node});
            vm.date_deleted = now;
            vm.flavor_history[vm.flavor_history.length-1].date_to = now;

            //On push vm dans la BD
            var res = await db.collection('vms').update(
               {'proxmox_id': proxmox_vmid, 'node': node},
               vm);
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await update_vm_delete(db);
        db.close();
        return result;
    }

    /*Récupère le taux horaire de facturation en fonction du flavor
    Concept de facturation en fonction des flavors inspiré de https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/*/ 
    public async get_flavor_billing_rate(flavorname: string): Promise<number> {
        var get_fbr = async function(db) {
             var res = await db.collection('allowed_flavors').findOne({"name": flavorname}).flavor_billing_rate;
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await get_fbr(db);
        db.close();
        return result;
    }

    /*Dit si un user est Free ou Premium*/
    public async getTypeOfUser(userlogin: string): Promise<string> {
        var functiongetuserType = async function(db) {
             var res = await db.collection('users').findOne({"login": userlogin}).typeofUser;
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await functiongetuserType(db);
        db.close();
        return result;
    }

    /*Liste les NOMS des flavors autorisés*/
    public async list_flavor_names() {
        var lister_noms_flavors = async function(db) {
            var clean_name_list = []
            var res = await db.collection('allowed_flavors').find({}, {"_id": 0, "name": 1}).forEach(function(doc){clean_name_list.push(doc.name)});
            return clean_name_list;
        }
        var db = await MongoClient.connect(this.url);
        var result = await lister_noms_flavors(db);
        db.close();
        return result;
    }

    /*Liste toutes les caractéristiques des flavors autorisés (nom, cpus...)*/
    public async list_flavors() {
        var lister_flavors = async function(db) {
            var res = await db.collection('allowed_flavors').find().toArray();
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await lister_flavors(db);
        db.close();
        return result;
    }

    /*Récupère les caractéristiques d'un flavor en ayant son nom*/
    public async get_flavor_by_name(flavorname) {
        var flavor_by_name = async function(db) {
            var res = await db.collection('allowed_flavors').findOne({"name": flavorname});
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await flavor_by_name(db);
        db.close();
        return result;
    }

    /*Compte le nombre de VMs ACTIVES d'un user*/
    public async countUserNbVM(userlogin: string): Promise<number> {
        var getNbVMs = async function(db) {
            var res = await db.collection('vms').find(
                {"owner": userlogin, 
                "date_deleted": null}).count();
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var NbVM = await getNbVMs(db);
        db.close();
        return NbVM;
    }

    /*Associer un backup à un vmid et un user*/
    public async associateVmBackupToAnUser(login: string, vmid: number, backupPath: string) {
        var functionAssociateBackup = async function(db) {
            var res = await db.collection('backups').insert({
                "owner": login,
                "vmid": vmid,
                "backupPath": backupPath
            });
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await functionAssociateBackup(db);
        db.close();
    }

    /*permet de savoir si l'utilisateur avait créé une backup pour la vm vmid*/
    public async hasBackupAssociateWithVm(login: string, vmid: number): Promise <boolean> {
        var functionhasBackup = async function(db) {
             var res = await db.collection('backups').find({"owner": login, "vmid": vmid}).count();
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await functionhasBackup(db);
        db.close();
        return result == 1;
    }

    /*Récupère le path d'un backup*/
    public async getBackupPath(login: string, vmid: number): Promise <string> {
        var functionhasBackup = async function(db) {
             var res = await db.collection('backups').find({"owner": login, "vmid": vmid}, {"_id":0, "backupPath":1}).toArray();
             return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await functionhasBackup(db);
        db.close();
        return result;
    }
   
    /*True si la VM est dédiée, False sinon*/
    public async is_vm_dedicated(node: string, proxmox_vmid: number): Promise <boolean> {
        var est_dedie = async function(db) {
            var res = await db.collection('vms').findOne({"node": node, "proxmox_vmid": proxmox_vmid}).is_dedicated;
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await est_dedie(db);
        db.close();
        return result;
    }

    /*Récupère la dernière date à laquelle un user a été facturé*/
    public async get_latest_billing_time(username: string): Promise <number> {
        var glbt = async function(db) {
            var res = await db.collection('users').findOne({"login": username}).last_billed;
            return res;
        }
        var db = await MongoClient.connect(this.url);
        var result = await glbt(db);
        db.close();
        return result;
    }

    /*Calcule le montant de facturation total pour un user sur les billing_period_seconds dernières secondes (typiquement 3600 = 1 heure mais on peut adapter pour démonstration)*/ 
    public async get_billing_amount_for_latest_period(username: string, billing_period_seconds: number): Promise <number> {
        var now = new Date();
        var billing_from = now;
        billing_from.setSeconds(now.getSeconds() - billing_period_seconds);
        var latest_billing_time = await this.get_latest_billing_time(username);
        var all_histories = [];
        var get_vms_to_bill = async function(db) {
            var vms_to_bill = await db.collection('vms').find(
                {$and: [
                    {"owner": "test"},
                    {"$or": [
                        {"date_deleted": null},
                        {"date_deleted": {"$gte": billing_from}}
                    ]}
                ]}
            ).toArray();
            return vms_to_bill;
        }

        var db = await MongoClient.connect(this.url);
        var vms_to_bill = await get_vms_to_bill(db);
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
            flavor_history.push({"date_from": now});
            var billing_for_vm = 0;
            for (var j = 0; j < flavor_history.length-1; j++) {
                flavor_history[j];
                var debut = new Date(flavor_history[j].date_from);
                var fin = new Date(flavor_history[j+1].date_from);
                var time_in_flavor = fin.getTime() - debut.getTime();
                var billing_periods_in_flavor = Math.ceil(time_in_flavor/billing_period_seconds);
                billing_for_vm += billing_periods_in_flavor * parseFloat(flavor_history[0].flavor_billing_rate);
            }
            billings_for_vms.push(billing_for_vm);
        }
        var sum = billings_for_vms.reduce(function(pv, cv) { return pv + cv; }, 0);

        return sum;
    }

    /*Récupère le montant d'argent que possède l'user*/
    public async get_user_money(login: string,): Promise<number> {
        var get_field_value = async function(db) {
            var res = await db.collection('users').findOne(
               {"login": login},
               {"_id": 0, "money": 1});
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await get_field_value(db);
        db.close();
        return result;
    }


    /*permet de savoir si l'utilisateur possède un compte*/
    public async hasAnAccount(login:string,password:string) : Promise<boolean>
    {
        var functionHasAnAccount = async function(db) {
             var res = await db.collection('users').find({"login": login, "password": password}).count();
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await functionHasAnAccount(db);
        console.log("result has account for "+login +" and password "+ password +" is : ", result);
        db.close();
        return result == 1;
    }

}
