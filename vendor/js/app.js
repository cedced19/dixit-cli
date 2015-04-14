$(document).ready(function() {
  var socket = io.connect(window.location.host);
  
  $(document).keypress(function(e) {
      if(e.which == 13) {
        socket.emit('do', {command:  $('#command').val(), path:  $('#path').val()});
      }
      
      $('#log').hide();
      $('#loader').show();
      
      if ($('#log').html() != ''){
       $('h2').show();
       $('#latest').html($('#log').html());
      }
  });
    
  socket.on('log', function (data){
      $('#log').show();
      $('#loader').hide();
      
      if (data.err  !== null){
        $('#log').html(data.err + data.log);
      }else{
        $('#log').html(data.log);   
      }
  });
    
  socket.on('path', function (data){
      $('#path').val(data.path);
  });
  
});