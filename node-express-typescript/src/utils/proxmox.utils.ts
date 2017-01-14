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
            var proxmox = new ProxmoxService('213.32.27.237', '/api2/json');
            ProxmoxUtils.proxApi= await proxmox.connect('root@pam', 'kpuJD5RuWP57');
        }
        return ProxmoxUtils.proxApi;
    }
}