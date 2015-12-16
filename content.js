chrome.storage.sync.get({
        signatures: {}
    }, function(items){
        $.each(items.signatures, function() {
            $.each(this, function(k, v) {
            var inCorrectSub = false;
                if (k == "subreddit"){
                    if (window.location.href.indexOf("/r/" + v + "/comments") > -1){
                        inCorrectSub = true;
                    } else {
                        inCorrectSub = false;
                    }
                }
                else if (k == "signature" && inCorrectSub){
                    var textbox = $(".md textarea");
                    textbox.val(v);
                }
                console.log(k + ": " + v);
            });
        });


});