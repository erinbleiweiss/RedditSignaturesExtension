chrome.storage.sync.get({
        signatures: {}
    }, function(items){
        $.each(items.signatures, function() {
            var subreddit = this.subreddit.toLowerCase();
            var url = window.location.href.toLowerCase();
            if (url.indexOf("/r/" + subreddit + "/comments") > -1) {
                if (this.active){
                    var textbox = $(".md textarea");
                    if (this.random){
                        var range = this.signature.length;
                        var rand_idx = Math.floor(Math.random() * range);
                        textbox.val(textbox.val() + "\n\n"+this.signature[rand_idx]);
                    } else{
                        textbox.val(textbox.val() + "\n\n"+this.signature);
                    }
                }
            }
        });
});