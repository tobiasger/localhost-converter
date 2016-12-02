// REMINDER:
// Add array/object for replacements?

// Get local IP function
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

    //If input doesn't contain "localhost"
    if (oldText.indexOf("localhost") <= -1) {
        console.log("No! Input did not contain 'localhost'.");
        $("input").addClass("error");
        setTimeout(function() {
            $("input").removeClass("error");
        }, 1000);
        $textArea.val("Not copied!");
    }
    //If input contains "localhost"
    else {
        console.log("Yes! Input did contain 'localhost'!");
        //Darker text on converted input
        $("input").addClass("new");
        //Flash effect on input
        $("input").addClass("success");
        setTimeout(function() {
            $("input").removeClass("success");
        }, 1000);
        getLocalIPAddress(function(ip) {
            //Entered texts value, with words replaced
            var newText = oldText.replace("localhost", ip);
            console.log("Local IP: " + newText);
            //Replace old value with new value and select it
            $textArea.val(newText).select();
            //Copy new text to clipboard and view new text in textarea
            document.execCommand('copy');
            $textArea.val("Copied!");
            //Deselect input after conversion
            $textArea.blur();
        });
    }
});

//Trigger click on button when pressing "enter"
$("input").keydown(function(event){
    if(event.keyCode == 13){
        $("button").click();
    }
});

//Remove "new" class when changing input field
$("input").on("change paste keyup", function() {
    $(this).removeClass("new");
});

$("input").on("click", function() {
    $(this).val('').focus();
});

//Clear input field when clicking on "clear" class
// $(".clear").click(function() {
//     $("input").val('').focus();
// });
