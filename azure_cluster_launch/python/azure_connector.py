from azure import *
from azure.servicemanagement import *

import settings

subscription_id = settings.SUBSCRIPTION_ID
certificate_path = settings.CERTIFICATE_PATH

# Service Manager used to Launch new instances
sms = ServiceManagementService(subscription_id, certificate_path)

# Lists all locations
result = sms.list_locations()
for location in result:
    print(location.name)


name = 'sjoshi6-test'
label = 'sjoshi6-test'
desc = 'test service'
location = 'West US'

# Launching a new instance
sms.create_hosted_service(name, label, desc, location)

# Retrive all listed services
result = sms.list_hosted_services()

# Printing results
for hosted_service in result:
    print('Service name: ' + hosted_service.service_name)
    print('Management URL: ' + hosted_service.url)
    print('Location: ' + hosted_service.hosted_service_properties.location)
    print('')
