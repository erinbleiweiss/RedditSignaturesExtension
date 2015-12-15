var textbox = $(".md textarea");

var isCFB = window.location.href.toLowerCase().indexOf("/r/cfb/comments") > -1;
if (isCFB){
    textbox.val("\n\nhello world");
}