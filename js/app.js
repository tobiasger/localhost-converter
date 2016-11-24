// REMINDER:
// Add array/object for replacements?

//Clicking button
$("button").click(function() {
    $("input").removeClass("enter");
    $("input").addClass("enter");
    var $textArea = $("input");
    //Entered texts value
    var oldText = $textArea.val();
    //Entered texts value, with words replaced
    var newText = oldText.replace("localhost", "192.168.0.12");
    //Replace old value with new value and select it
    $textArea.val(newText).select();
    //Copy new text to clipboard and view new text in textarea
    document.execCommand('copy');
    $textArea.val(newText);
});
