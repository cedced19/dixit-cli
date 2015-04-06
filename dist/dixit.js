#!/usr/bin/env node
'use strict';
var hapi = require('hapi'),
    app = new hapi.Server(),
    fs = require('fs'),
    program = require('commander'),
    pkg = require('./package.json'),
    port = 7775,
    ansi = require('ansi-html'), 
    exec = require('child_process').exec,
    colors = require('colors');

program
  .version(pkg.version)
  .option('-p, --port [number]', 'specified the port')
  .parse(process.argv);


if (!isNaN(parseFloat(program.port)) && isFinite(program.port)){
  port = program.port;
}
app.connection({ port: port });

app.route({
    method: 'GET',
    path: '/vendor/{param*}',
    handler: {
        directory: {
            path: __dirname + '/vendor/'
        }
    }
});

app.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file(__dirname + '/index.html');
    }
});


app.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: function (request, reply) {
        reply.file(__dirname + '/favicon.ico');
    }
});

app.start(function() {
    require('check-update')({packageName: pkg.name, packageVersion: pkg.version, isCLI: true}, function(err, latestVersion, defaultMessage){
        if(!err){
            console.log(defaultMessage);
        }
    });
    console.log('Server running at\n  => ' + colors.green('http://localhost:' + port) + '\nCTRL + C to shutdown');
});


var io = require('socket.io').listen(app.listener);
io.sockets.on('connection', function(socket){
      socket.on('do', function (data) {
        exec(data.command, function (error, stdout, stderr) {
         socket.emit('log', {log: ansi(stdout)});
            console.log(stdout);
      });
    });
});