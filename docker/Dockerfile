FROM ubuntu:14.04

RUN apt-get update -y
RUN apt-get install git -y
RUN apt-get install python-pip -y
RUN apt-get install npm -y
RUN apt-get install nodejs-legacy -y
RUN ln -s /usr/bin/nodejs /usr/sbin/node
RUN apt-get install software-properties-common -y
RUN apt-add-repository ppa:ansible/ansible -y
RUN apt-get install ansible -y
RUN git clone https://github.com/alt-code/AutoSpark.git
RUN cd AutoSpark/driver/;npm install
