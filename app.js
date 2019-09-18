/* Express server setup*/
var 
        gameport        = process.env.PORT || 4004,

        io              = require('socket.io'),
        express         = require('express'),
        UUID            = require('node-uuid'),

        verbose         = false,
        http            = require('http'),
        app             = express(),
        server          = http.createServer(app);

 //Tell the server to listen for incoming connections
 server.listen( gameport );

 //Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + gameport );

 //By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){ 
 res.sendfile( '/index.html', {root:__dirname} );
});


 //This handler will listen for requests on /*, any file from the root of our server.
 //See expressjs documentation for more info on routing.

app.get( '/*' , function( req, res, next ) {

     //This is the current file they have requested
 var file = req.params[0]; 

     //For debugging, we can track what files are requested.
 if(verbose) console.log('\t :: Express :: file requested : ' + file);

     //Send the requesting client the file.
 res.sendfile( __dirname + '/' + file );

}); //app.get *

/*Setting up a Socket.IO server*/

let sio = io.listen(app);

//configure socket.io
sio.configure(function(){
    
    sio.set('log level', 0);

    sio.set('authorization', function (handshakeData, callback) {
        callback(null, true); // error first callback style 
      });

  });

  //Enter the game server code. The game server handles
        //client connections looking for a game, creating games,
        //leaving games, joining games and ending games when they leave.
        game_server = require('./game.server.js');


  //Socket.io will call this function when a client connects, 
        //So we can send that client a unique ID we use so we can 
        //maintain the list of players.
        sio.sockets.on('connection', function (client) {
        
            //**MUST CREATE THIS**Generate a new UUID, looks something like 
            //5b2ca132-64bd-4513-99da-90e838ca47d1
            //and store this on their socket/connection
        client.userid = UUID();

            //tell the player they connected, giving them their id
        client.emit('onconnected', { id: client.userid } );

        //now we can find them a game to play with someone.
            //if no game exists with someone waiting, they create one and wait.
            game_server.findGame(client);

            //Useful to know when someone connects
        console.log('\t socket.io:: player ' + client.userid + ' connected');
        
            //When this client disconnects
        client.on('disconnect', function () {

                //Useful to know when someone disconnects
            console.log('\t socket.io:: client disconnected ' + client.userid );

        }); //client.on disconnect
     
    }); //sio.sockets.on connection