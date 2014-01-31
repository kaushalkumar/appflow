appflow (Real Time Entity Monitoring)
=====================================

This project aims to showcase the realtime monitoring of an entity in a visually interactive way.
Loan application was chosen as the entity around which this setup was done.

Please follow the steps given below to get this working

A. Install mongodb
   1. Download MongoDB from http://www.mongodb.org/downloads. 
      Choose Windows 64 bits. Unzip it in some folder, say C:\mongodb-2.4.8.
   2. Create a file named mongod.cfg with following configuration
      ##store data here
      dbpath=C:\mongodb-2.4.8\data\db
 
      ##all output go here
      logpath=C:\mongodb-2.4.8\log\mongo.log
 
      ##log read and write operations
      diaglog=3
   3. Add  config file (mongod.cfg) inside the extracted location. For example C:\mongodb-2.4.8.
   4. Create a folder named “data/db” inside the directory “C:\mongodb-2.4.8”
      Note: log folder will be created when we start using mongodb.
      data – folder where db is stored
      log – folder where mongodb logs are stored
      These configurations are actually in mongod.cfg file.
      
B. Start mongodb and test
   1. Start mongodb Server by using the following command from command prompt
      C:\mongodb-2.4.8\bin>mongod --config C:\mongodb-2.4.8\mongod.cfg
   2. Connect to mongodb by executing the following command from command prompt
      C:\mongodb-2.4.8\bin>mongo
   3. You would see a following output, which means that you are connected to “test” database in mongodb
      C:\mongodb-2.4.8\bin>mongo
      MongoDB shell version: 2.4.8
      connecting to: test
      >
   4. [Optional ]Execute following basic commands from mongodb console
      To get list of databases - 
      > show dbs
      
C. Install nodejs
   1. Download nodejs installer from http://nodejs.org/download/ . Download 64 bit msi file (node-v0.10.24-x64.msi)
   2. Follow default steps and install the msi file which was downloaded in previous step
   
D. Intall appflow in nodejs
   1. Download the code in any folder in your system (let us say u did it in C:\appflow)
   2. Open command prompt and navigate to C:\appflow
   3. Execute the following command
      npm install express –g
      npm install -d
      This will install all project dependencies for this project inside directory called node_modules
      
E. Launch appflow
   1. From command prompt execute following command
      node app.js
   2. Open browser and hit http://localhost:3000
   
F. Test the application
   1. Navigate to Setup Menu and click ResetDB. This will create a DB with default data in it.
   2. Click on Start button. This will start creating/updating/deleting loan application rabdomly from database.
   3. Open a different browser and check the appliaction number getting updated in home page.
   4. [Optional]: Modify the flow chart using Manage Flow Diagram Menu
   5. [Optional]: Manually create loan application
   6. [Optional]: Search loan application in different status
   7. [Optional]: Manage Application status

G. Technical stack
   1. jsPlumb
   2. Jade
   3. Bootstrap
   4. jQuery
   5. nodejs
   6. expressjs
   7. mongodb

