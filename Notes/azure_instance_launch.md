#Steps to launch an instance on Azure

1. Launch a new ubunutu instance on AWS
2. create the .pem and .cer files for that ubunutu instance
  ```
  `openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem`
  `openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer`
  ```
3. Copy that key from remote to local machine
  ```
  scp -i xxx.pem ubuntu@xxxx:/home/ubuntu/xxx.cer .
  ```
4. Upload the key to management portal Azure settings > Management Certificates > Upload
5. Go to the remote machine and use setup_machine.sh
5. Install azure python sdk
  ```
  sudo pip install azure
  ```
