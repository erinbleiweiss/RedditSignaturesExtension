var sig_idx = 0;

function save_options(){
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
    chrome.storage.sync.get({
        signatures: {}
    }, function(items){
        $.each(items.signatures, function(idx, val) {
            if (idx == 0){
                var row = $(".sub_row").first();
            } else{
                sig_idx++;
                var row = add_row();
            }
            $.each(this, function(k, v) {
                if (k == "subreddit"){
                    row.find(".subreddit").val(v)
                }
                else if (k == "signature"){
                    row.find(".signature").val(v);
                }
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
    clone.find(".subreddit").val("");
    clone.find(".signature").val("");
    clone.find(".s_tab a").attr("href", "#" + sig_idx + "_0");
    clone.find(".tab-pane").attr("id", sig_idx + "_0");
    clone.find(".s_tab").each(function (i, obj) {
        if (i > 0){
            obj.remove();
        }
    });

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


$(document).on('click', '.plus', function() {
    sig_idx++;

    var row = $(this).parent().parent().closest('.sub_row');
    var clone = $(".sub_row").first().clone();
    clone.find(".subreddit").val("");
    clone.find(".signature").val("");
    clone.insertAfter(row);
    clone.find(".s_tab").each(function (i, obj) {
        if (i > 0){
            obj.remove();
        }
    });
    clone.find(".tab_pane").each(function (i, obj) {
        if (i > 0){
            obj.remove();
        }
    });
    clone.find(".s_tab a").attr("href", "#" + sig_idx + "_0");
    clone.find(".tab-pane").attr("id", sig_idx + "_0");
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

});

$(document).on('click', '.minus', function() {
    if ($(".sub_row").length > 1){
        var row = $(this).parent().parent().closest('.sub_row');
        row.remove();
    }
});

$(document).on('change', '.random', function(){
    if($(this).is(":checked")){
        console.log('checked');
    } else {
        console.log('unchecked');
    }

});

$(document).on('click', '.nav-tabs a', function(e){
    if (!$(this).hasClass("addtab")){
        $(this).tab('show');
    } else{
        var tab = $(this).parent();
        addTab(tab);
    }
});


function addTab(plus_tab){
    var row_idx = plus_tab.siblings().first().find('a').attr('href');
    row_idx = row_idx.substr(1, row_idx.indexOf('_') - 1);

    var idx = plus_tab.siblings().length;
    var tab = $('.s_tab').first().clone();
    tab.removeClass('active');
    tab.find('a').attr('href', '#' + row_idx + '_' + idx);
    tab.insertBefore(plus_tab);

    var new_textbox = $('.tab-pane').first().clone();
    new_textbox.removeClass('active');
    new_textbox.attr('id', row_idx + '_' + idx);
    new_textbox.find('textarea').val('');
    var prev_idx = idx-1;
    new_textbox.insertAfter($("#" + row_idx + "_" + prev_idx));
}

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




