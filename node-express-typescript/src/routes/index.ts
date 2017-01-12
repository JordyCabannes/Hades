import {Router} from 'express';
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxService} from "../services/proxmox.service";
import {ProxmoxApiService} from "../services/proxmox-api.service";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";
import {DBManager}  from "../services/database/dbManager" ;


const index = Router();
/* GET home page. */
index.get('/', function(req, res, next) {
    // ajouter_user('coucou', 'blah', UserClass.Free)
    var db= new DBManager()
    db.ajouter_user("coucou", "prout", "toto");
    db.ajouter_vm_a_user('coucou', 130);
    console.log("lolilol");
});

/* GET Quick Start. */
index.get('/createVM', async function(req, res, next) {

    var proxmox = new ProxmoxService('ip', 'api2/json');
    var proxmoxApi : ProxmoxApiService = await proxmox.connect('root@pam', 'password');
    if(proxmoxApi != null) {


        var cNextVmId = await proxmoxApi.getClusterVmNextId();
        var container : ICreateLxcContainerRequest = {
            ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
            vmid : cNextVmId.id,
            password : 'rootroot',
            memory:1024
        }

        var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer('ns3060138', container);

        console.log(result);
    }
});


export default index;
