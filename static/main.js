
var student = true;
var valid = true;
var user_form = document.querySelector('#student_control');
var instructor_form = document.querySelector('#instructor_control');
var user_chatter_form = document.querySelector('#messageForm');

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var bottom_form = document.querySelector('#bottom_form');

var stompClient = null;
var username = null;

var user_name_val = null;
var instructor_name_val = null;
var index_msg = 1

var colors = [
   '#2196F3', '#32c787', '#00BCD4', '#ff5652',
   '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

user_form.classList.remove('hidden');
instructor_form.classList.add('hidden');


var socket = io.connect('https://nlpqwe23ssd1ddep.herokuapp.com');
var private_socket = io('https://nlpqwe23ssd1ddep.herokuapp.com/private');


$(document).ready(function() {

    $('#send_username').on('click', function() {
        if (student){
            user_name = $('#username').val();
            instructor_name = $('#username_01').val();
            user_name_val = user_name;
            instructor_name_val = instructor_name;
            private_socket.emit('username', {'username':user_name,'instructor':instructor_name});
        }else{
            user_name = $('#username').val();
            message = $('#data').val();
            user_name_val = user_name
            private_socket.emit('instructname', {'username':user_name,'message':message});
        }
    });

    private_socket.on('error_private_message', function(msg) {
        alert(msg);
        if(msg=='00'){
            usernamePage.classList.add('hidden');
            chatPage.classList.remove('hidden');
            if(!student){
               bottom_form.classList.add('hidden');
            }
        }else{
            $("#error_happen").text('<li>'+msg.n+'</li>');
        }
    });

    $('#user_send_click').on('click', function() {
        $("#messageArea").append('<li>'+$('#private_message').val()+'</li>');
        private_socket.emit('private_user_message', {'username':instructor_name_val,'message':$('#private_message').val(),'me':user_name_val});
    });

    $('#instructor_send_click').on('click', function() {
        //private_socket.emit('private_instructor_message', {'username':user_name,'sender':'instructor':instructor_name});
    });

    private_socket.on('new_private_user_message', function(input) {
        index_msg++;
        $("#messageArea").append('<li>'+'<div class="form-inline"><div class="form-group"><label class="sr-only" id="sender_'+index_msg+'" "> '+input.me+' </label><br><label class="sr-only" id="response"  for="emailInput"> '+input.content+'</label></div><div class="form-group"><input type="text" class="form-control" id="replyinput_'+index_msg+'" placeholder="Add your reply here"></div><button id="sendbutton_'+index_msg+'" onclick="ReplyButton(this.id)" type="" class="btn btn-default">Submit</button></div>'+'</li>');
    });

    private_socket.on('new_private_instructor_message', function(input) {
        $("#messageArea").append('<li>'+input+'</li>');
    });

    private_socket.on('set_header',function(header){
        $("#question").append(header);
    });

});

//Drop Down Button
function selectItem(){
    var selectorr_id = document.querySelector('#selector');
    var selected_text = selectorr_id.value;
    if (selected_text == 'Student'){
        student = true;

        user_form.classList.remove('hidden');
        instructor_form.classList.add('hidden');
    }else{
        student = false;
        user_form.classList.add('hidden');
        instructor_form.classList.remove('hidden');
        user_chatter_form.classList.add('hidden');
    }
}


//This is For Instructor Reply Area
function ReplyButton(id){
    var temp_array = id.split("_");
    reciever = $('#sender_'+temp_array[1]).text();
    message = $('#replyinput_'+temp_array[1]).val();
    private_socket.emit('send_instructor_reply', {'reciever':reciever,'message':message});
}

