# Websocket Stream Demo Project

## Requirements
- quick REACT project, 
- nodejs backend 
- instead of REST: the REACT client will connect to backend with web sockets 
- a worker will produce random text and will stream through the web sockets 
- the REACT client will display streamed text, 
- also as a bonus: can we add simple connection timeout / error handling with web sockets

## Plan summary (quick)

- Worker: a Socket.IO client that connects to the backend and emits message events containing random text.
- Backend (Express + Socket.IO): accepts worker connections, and broadcasts incoming worker events to all connected browser clients.
- Client (React): connects via Socket.IO client, listens for message events and displays streamed text.
- Error handling: use Socket.IO built-in ping/pong + client-side reconnection/backoff; add keepalive timeout / UI state; show reconnect attempts and fallback.

## TODO
- [x] need 3 applications in: worker, client, server folders 
- [x] create server app: 
  - cd server
  - npm init -y
  - npm i express socket.io
  - npm i -D typescript @types/express @types/node ts-node nodemon
  - tsconfig.json
  - index.ts
  - 
- [x] create worker app
  - cd worker
  - npm init -y
  - npm i socket.io-client
  - npm i -D typescript @types/node ts-node
  - tsconfig.json
  - index.ts
- [x] create client app
  - npm create vite@latest client -- --template react-ts
  - cd client
  - npm i
  - npm i socket.io-client
- [x] run the apps and see the outcome on browser
  - cd server
  - npm run dev
  - cd worker
  - npm run dev
  - cd client
  - npm run dev
  - open http://localhost:5173
