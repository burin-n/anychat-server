# AnyChat Backend Server

Distributed System Class' mini project.
For frontend server repo, it is located [here](https://github.com/thipokKub/ani-chat-front).

### Tested on
    node 8.11.1
    npm 5.6.0
    yarn 1.6.0
    mongodb 3.6.4

### Installation
1. run mongodb
2. `yarn install`
3. heartbeat server
    - config variables about main server and backup server url in [heartbeat.js](https://github.com/burin-n/anychat-server/blob/master/heartbeat.js)
    - run with `yarn start`, server will run at port 5000 by default
   
  
4. API server
     - run with `yarn start [port]`
    
      - A deault port is 3001, but you can add an argument to change the port. 
    
      - The port should match configuration of heartbeat server, if not heartbeat won't find any active server.



Run both of backend and heartbeat.

Hearthbeat will communicate with frontend about which backend server is avaiable.
