// REMINDER:
// Add array/object for replacements?

function getLocalIPAddress(success) {
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
    var pc = new RTCPeerConnection({
            iceServers: []
        }),
        noop = function() {};
    pc.createDataChannel(""); //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description

    pc.onicecandidate = function(ice) { //listen for candidate events
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
        pc.onicecandidate = noop;

        success(myIP);
    };
}

//Clicking button
$("button").click(function() {

    var $textArea = $("input");

    //Entered texts value
    var oldText = $textArea.val();

    getLocalIPAddress(function(ip) {

        //Entered texts value, with words replaced
        var newText = oldText.replace("localhost", ip);

        console.log(newText);
        //Replace old value with new value and select it
        $textArea.val(newText).select();
        //Copy new text to clipboard and view new text in textarea
        document.execCommand('copy');
        $textArea.val(newText);

    });
});

$(".after").click(function(){
  $("input").val('');
});
