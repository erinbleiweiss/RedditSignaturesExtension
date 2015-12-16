function save_options(){
    var number = $("#myoptions").val();
    var signatures = [];
    $('.sub_row').each(function() {
        var data = {};
        var subreddit = $(this).find(".subreddit").val();
        var signature = $(this).find(".signature").val();
        data['subreddit'] = subreddit;
        data['signature'] = signature;
        signatures.push(data);
    });

    chrome.storage.sync.set({
        favoriteNumber: number,
        signatures: signatures
    }, function(){
       // Update status to let user know options were saved.
        var status = $("#status");
        status.text('Options saved.');
        setTimeout(function(){
            status.text('');
        }, 2000);
    });
}

// Restores options state using the preferences
// stored in chrome.storage.
function restore_options(){
    // Use default number = 'one'
    chrome.storage.sync.get({
        favoriteNumber: 'one',
        signatures: {}
    }, function(items){
        $('#myoptions').val(items.favoriteNumber);
        //console.log(items.signatures);
        $.each(items.signatures, function() {
            var clone = add_row();
            $.each(this, function(k, v) {
                if (k == "subreddit"){
                    clone.find(".subreddit").val(v)
                }
                else if (k == "signature"){
                    clone.find(".signature").val(v);
                }
                console.log(k + ": " + v);
            });
        });

    });
}

$(document).ready(function() {
    restore_options();
});
$("#save").click(function() {
   save_options();
});

function add_row(){
    var clone = $(".sub_row").first().clone();
    clone.find(".subreddit").val("/r/");
    clone.insertAfter($(".sub_row").last());
    clone.find(".subreddit").autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "http://api.reddit.com/subreddits/search.json?q=" + request.term,
                success: function (data) {
                    var results = [];
                    $.each(data.data.children, function( i, item ) {
                        results.push(item.data.display_name);
                    });
                    response(results);
                }
            });
        },
        minLength: 2
    });
    return clone
}


$("#plus").click(function() {
    add_row();
});

$("#minus").click(function() {
    if ($(".sub_row").length > 1){
        $(".sub_row").last().remove();
    }
});

$(document).ready(function() {
    //console.log("*");
});

$(".subreddit").each(function() {
    $(this).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "http://api.reddit.com/subreddits/search.json?q=" + request.term,
                success: function (data) {
                    var results = [];
                    $.each(data.data.children, function( i, item ) {
                        results.push(item.data.display_name);
                    });
                    response(results);
                }
            });
        },
        minLength: 2
    });

});




