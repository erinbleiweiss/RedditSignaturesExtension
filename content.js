chrome.storage.sync.get({
        signatures: {}
    }, function(items){
        $.each(items.signatures, function() {
            if (window.location.href.indexOf("/r/" + this.subreddit + "/comments") > -1) {
                var textbox = $(".md textarea");
                if (this.random){
                    var range = this.signature.length;
                    var rand_idx = Math.floor(Math.random() * range);
                    textbox.val(textbox.val() + "\n\n"+this.signature[rand_idx]);
                } else{
                    textbox.val(textbox.val() + "\n\n"+this.signature);
                }
            }
        });
});