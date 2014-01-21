$(document).ready( function(){

  var messages = [];
  var parseURL = 'https://api.parse.com/1/classes/chatterbox';

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
    sendMessage(textVal);
    $('#draft').val('');
    $('.send').attr('disabled', true);
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

  var refreshMessages = function(messages) {
    getMessages();
    console.log(messages);
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
  };

  var getMessages = function() {
    // var returnedMessages;
    $.ajax('https://api.parse.com/1/classes/chatterbox?order=-createdAt',{
      type: 'GET',
      contentType: 'application/json',
      success: function(data){
        messages.push(data.results);
        // refreshMessages(data);
      }
    });
    // console.log("From getMessages, returnedMessages =" + returnedMessages);
    // return returnedMessages;
  };

  // var chatSend = function(stuff){
  //   sentObj = {};
  //   sentObj['text'] = stuff;
  //   $.ajax('https://api.parse.com/1/classes/chats', {
  //     type: "POST",
  //     data : JSON.stringify(sentObj),
  //     success:function(data){
  //       console.log("message sent");
  //     }
  //   });
  //   // fetch(display);
  // };

  // var displayMessages = function(data){
  //   if(initiate > 0){
  //     $('.allMessages').append($('<li>').append(data.results[90].text));
  //   } else {
  //     _.each(data, function(val, x){
  //       _.each(val, function(msg){
  //         $('.allMessages').append($('<li>').append(msg.text));
  //         console.log(msg.text);
  //       });
  //     });
  //   }
  //   initiate += 1;
  //   latestId = data.results[0].objectId;
  //   if($('ul.messages li').length > 10){
  //     $('.messages li').first().remove();
  //   }
  // };



  // setInterval(function(){
  //   $.ajax('https://api.parse.com/1/classes/chatterbox', {
  //     success: function(data) {
  //       console.log(data);
  //     }
  //   });
  // },2000);
  refreshMessages();
  setInterval(refreshMessages(), 3000);
});