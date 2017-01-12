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
index.post('/createVM', async function(req, res, next) 
{
    console.log(req.body);
    var container : ICreateLxcContainerRequest = 
    {
        ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
        vmid : 11251,
        password : req.body.password,
        memory:req.body.memory
    }

    var proxmox = new ProxmoxService('ip', '/api2/json');
    var proxmoxApi : ProxmoxApiService = await proxmox.connect('root@pam', 'password');
    if(proxmoxApi != null) 
    {
        console.log(" connection object " + proxmoxApi);
        var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer(container);
        res.send(result);//send back vm creation information
    }
    //error 
    res.send({})
});


export default index;
