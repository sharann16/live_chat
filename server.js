const express=require('express');
const http=require('http');
const WebSocket=require('ws');
const cors=require('cors');
const { resolveObjectURL } = require('buffer');
const path = require("path");


const app=express();
app.use(cors());

const server=http.createServer(app);
const wss=new WebSocket.Server({server});

const user={};

app.use(express.static(path.join(__dirname, 'public')));



wss.on("connection",(ws)=>{
    console.log("new user join");


    ws.on("message",data=>{
        const message=JSON.parse(data);

        if(message.type==="join"){
            user[message.mobileNumber]=ws;
            console.log(`user connected ${message.mobileNumber}`)
        }


        else if(message.type==="sendMessage"){
            const { sender, receiver, text } = message;

            console.log(`sender ${sender} : receiver ${receiver} -> ${text}`);


            if(user[receiver]){
                user[receiver].send(JSON.stringify({sender , text}));
            }else{
                console.log("user offline");
            }
        }




    })

    ws.on("close",()=>{
        for(const [mobile,socket] of Object.entries(user)){
            if (socket===ws){
                console.log(`${mobile} disconnect3ed`);
                delete user[mobile];
                break;
            }
        }
    })
})



server.listen(5000,()=>{
    console.log("websocket server running");
})