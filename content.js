chrome.storage.sync.get({
        signatures: {}
    }, function(items){
        $.each(items.signatures, function() {
            if (window.location.href.indexOf("/r/" + this.subreddit + "/comments") > -1) {
                var textbox = $(".md textarea");
                textbox.val("\n\n"+this.signature);
            }
        });
});