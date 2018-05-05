# AnyChat Backend Server

Distributed System Class' mini project.
For frontend server repo, it is located [here](https://github.com/thipokKub/ani-chat-front).

### Installation
1. `yarn install`
2. heartbeat server
    - config variables about main server and backup server url in [heartbeat.js](https://github.com/burin-n/anychat-server/blob/master/heartbeat.js)
    - run with `yarn start`, server will run at port 5000 by default
   
  
2. API server
     - run with `yarn start [port]`
    
      - A deault port is 3001, but you can add an argument to change the port. 
    
      - The port should match configuration of heartbeat server, if not heartbeat won't find any active server.


Run both of server, hearthbeat will communicate with frontend about which server is avaiable.
