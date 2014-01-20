var sentObj = {};
var latestId = "";
var initiate = 0;



var chatSend = function(stuff){
  sentObj = {};
  sentObj['text'] = stuff;
  $.ajax('https://api.parse.com/1/classes/chats', {
    type: "POST",
    data : JSON.stringify(sentObj),
    success:function(data){
      console.log("message sent");
    }
  });
  fetch(display);
};

var displayMessages = function(data, val, id){
  if(initiate > 0){
    $('.messageBox').append($('<li>').append(data.results[90].text));
  } else {
    _.each(data, function(val, x){
      _.each(val, function(msg){
        $('.messageBox').append($('<li>').append(msg.text));
        console.log(msg.text);
      });
    });
  }
  initiate += 1;
  latestId = data.results[0].objectId;
  if($('ul.messages li').length > 10){
    $('.messages li').first().remove();
  }
};


setInterval(function(){ 
  $.ajax('https://api.parse.com/1/classes/chatterbox', {
    success: function(data) {
      displayMessages(data.results);
      console.log(data.results);
    }
  });
},2000);

$('.draft').keyup(function(){
  if($(this).val().length != 0){
    $('.send').attr('disabled', false);
  }
  else{
    $('.send').attr('disabled', true);
  }
});


var textVal = "";
//saves text value, uses send func, clears text, disables button
var sendClearDisable = function(){
  textVal = $('.draft').val();
  chatSend(textVal);
  $('.draft').val('');
  $('.send').attr('disabled', true);
}

//on pressing enter
$('.draft').keypress(function(Q){
  if(Q.which == 13){
    sendClearDisable();
  }
});

//on button click
$('.send').click(function(){
  sendClearDisable();
});