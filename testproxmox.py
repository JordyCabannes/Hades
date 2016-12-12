from pyproxmox.src.pyproxmox import *

#Disable warnings
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

a = prox_auth('213.32.27.237','root@pam','N4rmwE3JeztE') #local
#a = prox_auth('127.0.0.1','root@pam','rooot') #local
b = pyproxmox(a)

status = b.getClusterStatus()
print(status)

print("\n\n\nHello!\n\n\n")

def creer_container_test():
	post_data = {
		'vmid':'101',
		'hostname':'test.example.org',
		'storage':'local',
		'password':'rooot',
		'ostemplate':'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
		#'ostemplate':'local:vztmpl/debian-6.0-standard_6.0-6_i386.tar.gz',
		'memory':'1024',
		'swap':'1024',
		'disk':'10',
	    'cpus':'4',
	}

	returndata = b.createOpenvzContainer('ns3060138', post_data)
	if returndata['data'] is None:
		print('Erreur !')
	else:
		print('all good !')
	print(returndata)

print(b.getClusterVmNextId())

creer_container_test()
