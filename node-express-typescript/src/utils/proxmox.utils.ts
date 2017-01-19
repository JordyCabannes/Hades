import {ProxmoxApiService} from "../services/proxmox-api.service";
import {ProxmoxService} from "../services/proxmox.service";
/**
 * Created by Halim on 14/01/2017.
 */

export class ProxmoxUtils {

    private static proxApi : ProxmoxApiService = null;
    public static async getPromoxApi() : Promise<ProxmoxApiService> //TODO:gérer le cas où le token n'est plus valide car il a expiré
    {
        if(ProxmoxUtils.proxApi == null)
        {
            var proxmox = new ProxmoxService('ip', '/api2/json');
            ProxmoxUtils.proxApi= await proxmox.connect('root@pam', 'password');
            if(ProxmoxUtils.proxApi != null)
                ProxmoxUtils.proxApi.node = 'ns3060138';
        }
        return ProxmoxUtils.proxApi;
    }

    public static async getPromoxApi2() : Promise<ProxmoxApiService> //TODO:gérer le cas où le token n'est plus valide car il a expiré
    {
        if(ProxmoxUtils.proxApi == null)
        {
            var proxmox = new ProxmoxService('ip', '/api2/json');
            ProxmoxUtils.proxApi= await proxmox.connect('root@pam', 'password');
            if(ProxmoxUtils.proxApi != null)
                ProxmoxUtils.proxApi.node = 'ns3019351';
        }
        return ProxmoxUtils.proxApi;
    }
}