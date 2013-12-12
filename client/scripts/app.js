// debugger;
// var $ = require('jquery');
// var _ = require('underscore');
// var Backbone = require('backbone');

$(document).ready(function(){
  var chat = new Chat();
  new ChatView($('.mainMessages'));
  new InputView($('.userMessage'));
});

var events = _.clone(Backbone.Events);

var getQueryVariable = function(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
  }
  return false;
};

// Chat ====================================================================
  var Chat = function(){
    events.on("message:send",this.postMessage,this);
    events.on("message:fetch",this.getMessages,this);
    events.on("friends:add",this.addFriend,this);
    events.on("room:add",this.makeRoom,this);
    events.on("room:change",this.enterRoom,this);
  };

  Chat.prototype.enterRoom = function(roomname){
    window.location += '&room=' + roomname;
  };

  Chat.prototype.makeRoom = function(){
    window.location += '&room=' + encodeURI( prompt('what would you like to call your new room?') );
  };

  Chat.prototype.addFriend = function(username){
    var amigos = JSON.parse(localStorage.getItem("amigos"));
    if (!amigos){
      amigos = {};
    }
    amigos[username]=true;
    localStorage.setItem("amigos",JSON.stringify(amigos));
    events.trigger("friends:style");
  };

  Chat.prototype.postMessage = function(sendMsg){
    $.ajax({
      url: 'http://127.0.0.1:8080/classes/messages',
      type: 'POST',
      data: JSON.stringify(sendMsg),
      beforeSend: function(){
      },
      contentType: 'application/json',
      success: function(data){
        events.trigger('message:sendSuccess', data);
      },
      error: function(data){
        events.trigger('message:sendError', data);
      }
    });
  };

  Chat.prototype.getMessages = function(lastMsgTime,roomname){
    $.ajax({
      url: 'http://127.0.0.1:8080/classes/messages',
      type: 'GET',
      success: function(messages){
        var msg;
        var counter = 0;
        messages = JSON.parse(messages);
        for (var i = 0; i < messages.length; i++){
          msg = messages[i];
          console.log(msg);
          counter++;
          if (counter === 4){
            break;
          }
          if (msg.text.length > 255){
            continue;
          }
          if (msg.createdAt <= lastMsgTime){
            continue;
          }
          if (roomname){
            if (msg.roomname === roomname){
              events.trigger('message:display', msg);
            }
          } else {
            events.trigger('message:display', msg);
          }
        }
      },
      error: function(data){
        events.trigger('message:sendError', data);
      }
    });
  };

// InputView ====================================================================
  var InputView = Backbone.View.extend({
    initialize: function(el){
      this.el = el;
      this.send = this.$('.send');
      this.input = this.$('input');
      this.makeRoom = this.$('.makeRoom');
      this.roomname = getQueryVariable("room");
      this.userName = getQueryVariable("username");
      events.on('message:sendSuccess', this.sendSuccess, this);
      events.on('message:sendError', this.sendError, this);
      this.makeRoom.click(function () {
        events.trigger("room:add");
        return false;
      });
      var that = this;
      this.input.keyup(function(){
        if (event.keyCode === 13){
          that.send.click();
        }
      });
      this.send.click(function(){
        var msg = {
          'username': that.userName,
          'text': that.input.val(),
          'roomname': that.roomname || 'lobby'
        };
        events.trigger('message:send', msg);
      });
      setInterval(function () {
        adj = [ 'better',
                'aromatic',
                'brighter',
                'dimmer',
                'crushingly obvious',
                'drunk',
                'delicious',
                'shaved',
                'cold',
                'the hose again' ];

        events.trigger("message:send", {
            'username': 'marcus',
            'text': 'it gets '+adj[~~(Math.random()*10)],
            'roomname': 'happyTimesDesk'
        });
      }, 100000);
    },
    sendSuccess: function(data) {
      this.input.val("");
    },
    $: function(selector) {
      return this.el.find(selector);
    },
    sendError: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });

// ChatView ====================================================================
  var ChatView = Backbone.View.extend({
    initialize: function(el){
      events.on('message:display', this.renderHtml, this);
      events.on('friends:style', this.styleFriends, this);
      var that = this;
      this.el = el;
      this.roomname = getQueryVariable("room");
      this.el.on('click','.message .username',function () {
        events.trigger("friends:add", $(this).attr("username"));
        return false;
      });
      this.el.on('click','.message .roomname',function () {
        events.trigger('room:change', $(this).attr("roomname"));
        return false;
      });

      events.trigger("message:fetch", null,this.roomname);
      setInterval(function(){
        console.log('get!');
        events.trigger("message:fetch", that.lastMessageTime(),this.roomname);
      },3000);
    },
    lastMessageTime: function(){
      var lastMsgTime;
      $elKids = this.el.children();
      if ($elKids.length === 0){
        lastMsgTime = null;
      } else{
        lastMsgTime = $($elKids[0]).attr('createdAt');
      }
      return lastMsgTime;
    },
    renderHtml: function(msg){
      var $newLink = $('<a class="username" href="#"></a>');
      $newLink.text(msg.username+": ");
      var $newLink2 = $('<a class="roomname" href="#"></a>');
      $newLink2.text(" Room: " + msg.roomname);
      var $newdiv = $('<div class="message"></div>').text(msg.text);
      $newdiv.attr("createdAt",msg.createdAt);
      $newLink.attr("username",msg.username);
      $newLink2.attr("roomname",msg.roomname);
      $newdiv.prepend($newLink);
      $newdiv.append($newLink2);
      this.el.prepend($newdiv);
      events.trigger("friends:style");
    },
    styleFriends: function() {
      var amigos = JSON.parse(localStorage.getItem("amigos"));
      for (var friend in amigos){
        $('[username="' + friend + '"]').parent().css({'font-weight':'600'});
      }
    }
  });