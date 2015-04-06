$(document).ready(function() {
  var socket = io.connect(window.location.host);
  
  $(document).keypress(function(e) {
        if(e.which == 13) {
            socket.emit('do', {command: document.getElementById('command').value});
        }
  });
    
  socket.on('log', function (data){
      $('#log').html(data.log);
      console.log(data);
  });



});