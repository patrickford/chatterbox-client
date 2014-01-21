$(document).ready( function(){

  var messages = [];
  var rooms = {};
  var parseURL = 'https://api.parse.com/1/classes/chatterbox?order=-createdAt';

// Toggles the disabled attribute of the send button upon text entry into draft
  $('#draft').keyup(function(){
    if($(this).val().length !== 0){
      $('.send').attr('disabled', false);
    }
    else{
      $('.send').attr('disabled', true);
    }
  });

// Saves text value, uses send func, clears text, disables button
  var sendClearDisable = function(){
    var textVal = $('#draft').val();
    if(textVal.length>0){
      sendMessage(textVal);
      $('#draft').val('');
      $('.send').attr('disabled', true);
    }
  };

  //on pressing enter
  $('#draft').keypress(function(Q){
    if(Q.which == 13){
      sendClearDisable();
    }
  });

  //on button click
  $('.send').click(function(){
    sendClearDisable();
  });

  var drawMessages = function() {
    $('.allMessages').empty();
    for (var i = 0; i < messages.length; i++) {
      if (!rooms.hasOwnProperty(messages[i].roomname)) {
        rooms[messages[i].roomname]=1;
        $('#rooms').append('<option value=' + messages[i].roomname + '>' + messages[i].roomname + '</option>');
    }
      $('.allMessages').append('<li> <b>' + _.escape(messages[i].username) + '</b>' + ': ' + _.escape(messages[i].text) + '</li>');
    }
  };

  var sendMessage = function(message) {
    var username = window.location.search.slice(10);
    var messageObj = {};
    messageObj.username = username;
    messageObj.text = message;
    messageObj.roomname = "lobby";

    $.ajax({
      url: parseURL,
      type: 'POST',
      data: JSON.stringify(messageObj),
      contentType: 'application/json',
      success: function(data) {
        console.log("Chatterbox: Message successfully sent");
      },
      error: function(data) {
        console.error('Chatterbox: Failed to send message');
      }
    });
    getMessages();
  };

  var getMessages = function() {
    // var returnedMessages;
    $.ajax(parseURL,{
      type: 'GET',
      contentType: 'application/json',
      success: function(data){
        messages = data.results;
        drawMessages();
      }
    });
  };

  getMessages();
  setInterval(function(){
    getMessages();
  },2000);
});