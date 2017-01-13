import {Router} from 'express';
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxService} from "../services/proxmox.service";
import {ProxmoxApiService} from "../services/proxmox-api.service";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";

import {DBManager}  from "../services/database/dbManager" ;


const index = Router();

/*db Manager*/
var db= new DBManager();



/* GET home page. */
index.get('/', function(req, res, next) {
    // ajouter_user('coucou', 'blah', UserClass.Free)
    
    db.ajouter_user("coucou", "prout", "Free");
    db.ajouter_vm_a_user('coucou', 130);
    console.log("lolilol");
});

/* post createVM */
index.post('/createVM', async function(req, res, next) 
{
    console.log("request body" + req.body);

    //connection 
    var proxmox = new ProxmoxService('ip', '/api2/json');
    var proxmoxApi : ProxmoxApiService = await proxmox.connect('root@pam', 'password');

    //free or premium
    var typeUser = await db.getTypeOfUser("coucou");
    var numberVM =  await db.countUserNbVM("coucou");
    console.log(".............****************************", typeUser);
    console.log("..............********************************",numberVM);
    if (typeUser=="Free" && numberVM>0)
    {
        res.send({"containerID":-1,"information":"Cannot create more vm"})
    }else
    {
   
        if(proxmoxApi != null) 
        {
            var ObjectID  :IGetClusterVmNextIdReply  = await  proxmoxApi.getClusterVmNextId() ;

            var container : ICreateLxcContainerRequest = 
            {
                ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
                vmid : ObjectID.id,
                password : req.body.password,
                memory:req.body.memory,
            }

            
            var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer('ns3060138',container);
            if (result==null)
            {
                res.send({"containerID":-1,"information":""})
            }else
            {
                db.ajouter_vm_a_user(req.body.login,ObjectID.id);
                res.send({"containerID":ObjectID.id,"information":""});//send back vm creation information
            }

            
        }else 
        {
             res.send({"containerID":-1})
        }
    }
});


export default index;
