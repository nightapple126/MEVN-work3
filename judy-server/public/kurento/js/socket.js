
       
 

var $to_id = '';

$(function(){
  
   var socket = io.connect('https://' + location.host);
   var $messageForm = $('#messageForm');
   var $message  = $('#message');
   var $chat  = $('#chat');
   var $messsageArea = $('#messsageArea');
   var $userForm  = $('#userForm');
   var $users  = $('#users');
   var $userFormArea  = $('#userFormArea');
   var $username  = $('#name');
    
   var $to = $("#to");
   var $toInput = $("#peer");
   var $connectedUser = $("#connectedUser");
   

   $messageForm.submit(function(e){
       e.preventDefault();
       if($toInput.val() != ''){
        socket.emit("send message",  {msg : $message.val() , reciver : $to_id });
      
        $chat.append('<div class="well">   <b> Me___:</b>'+ $message.val()+'</div>');
        $message.val('');

       }
       $message.val('');
      
       
   });

   document.getElementById('register').addEventListener('click', function() {

    
    socket.emit("new user",$username.val(),function(data){
        if(data){
            $userForm.hide();
            $messsageArea.show();
           
        }
    });
    $connectedUser.html( $username.val());
   // $username.val('');
  
});

  $userForm.submit(function(e){
       e.preventDefault();
      
       
   });
   
   socket.on('get users',function(data){
       var html = '';
       var $connectedUser = $("#connectedUser");
       for( i = 0 ; i < data.length ; i++){

           var id = (data[i].id).toString() ;
           var username = (data[i].username).toString() ;
           
           if(username!= $connectedUser.html()){
            html +='<a  onclick="changeReciver(\''+id+'\' , \''+username+'\' )"> <li class="list-group-item" > '+data[i].username+'</li> </a> ';
        }
         

       }
       $users.html(html);

   }) ;

  
   socket.on('new message',function(data){
       $chat.append('<div class="well">   <b>'+data.from+'___:</b>'+ data.msg+'</div>');
       var notification = new Notification(data.from,{
           body : data.msg
       });
   }); 

   socket.on("bye",function(userbye , data){
    var $connectedUser = $("#connectedUser");
       var html = '';
       for( i = 0 ; i < data.length ; i++){
           var id = (data[i].id).toString() ;
           var username = (data[i].username).toString() ;
          
           if(username!= $connectedUser.html()){
            html +='<a  onclick="changeReciver(\''+id+'\' , \''+username+'\' )"> <li class="list-group-item" > '+data[i].username+'</li> </a> ';
        }
         
       }
       $users.html(html);
       console.log(userbye +" left the room");
   })


});

function changeReciver(id,username){
   
   var $to = $("#to");
   var $toInput = $("#peer");
   var $connectedUser = $("#connectedUser");

   if(username== $connectedUser.html()){
          return false ;
      }
   $to.html(username);
   $toInput.val(username) ;
   $to_id = id;
  
   
     

           }



