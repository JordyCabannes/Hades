#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pyproxmox import *
from pprint import pprint
#Disable warnings
import requests
# from requests.packages.urllib3.exceptions import InsecureRequestWarning
# requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

a = prox_auth('127.0.0.1','root@pam','proxmox') #local
b = pyproxmox(a)
status = b.getClusterStatus()
print(status)

print("\n\n\nHello!\n\n\n")

def creer_container_test():
    post_data = {'ostemplate':'local:vztmpl/debian-7.0-standard_7.0-2_i386.tar.gz',
                'vmid':'9004','cpus':'4','description':'test container',
                'disk':'10','hostname':'test.example.org','memory':'1024',
                'password':'testPassword','swap':'1024'}

    returndata = b.createOpenvzContainer('pve', post_data)
    if returndata['data'] is None:
        print('Erreur lors de la création du container !')
        #Vérifier que le container dont postdata['vmid'] existe
        
        
    else:
        print('all good !')
    print(returndata)


pve_networkdata = b.getNodeNetworks('pve')['data'][0]
pprint(pve_networkdata)
node_container_index = b.getNodeContainerIndex('pve')['data'][0]
pprint(node_container_index)


