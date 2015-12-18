var sig_idx = 0;

function save_options(){
    var signatures = [];
    $('.sub_row').each(function() {
        var data = {};
        var subreddit = $(this).find(".subreddit").val();
        data['subreddit'] = subreddit;
        if ($(this).find(".random").is(':checked')){
            data['random'] = true;

            var signature_options = [];
            $(this).find(".signature").each(function(i, obj){
                var text = $(this).val();
                console.log(text);
                signature_options.push(text);
            });
            data['signature'] = signature_options;

        } else {
            data['random'] = false;
            var signature = $(this).find(".signature").val();
            data['signature'] = signature;
        }
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
        var random = false;
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
                else if (k == "random"){
                    if (v == true){
                        random = true;
                        row.find(".random").prop('checked', true);
                        row.find(".nav").show();
                        row.find(".remove").show();
                    } else {
                        random = false;
                        row.find(".random").prop('checked', false);
                        row.find(".nav").hide();
                        row.find(".remove").hide();
                    }
                }
                else if (k == "signature"){
                    console.log(v);
                    if (random){
                        var plus_tab = row.find('.addtab').parent();
                        for (var i=0; i< v.length-1; i++){
                            addTab(plus_tab);
                        }
                        row.find('.tab-pane').each(function (i, obj){
                           $(this).find('textarea').val(v[i]);
                        });
                    }
                    else{
                        row.find(".signature").val(v);
                    }
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
            $(this).remove();
        }
    });
    clone.find(".tab-pane").each(function (i, obj) {
        if (i > 0){
            $(this).remove();
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
    clone.find(".random").prop('checked', false);
    clone.find(".nav").hide();
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
    var row = $(this).parent().parent().parent();

    if($(this).is(":checked")){
        row.find('.nav').show();
        row.find('.remove').show();
    } else {
        row.find('.nav').hide();
        row.find('.remove').hide();
        row.find('.s_tab.active').removeClass('active');
        row.find('.s_tab a[href$="_0"]').parent().addClass('active');
        row.find('.tab-pane.active').removeClass('active');
        row.find('[id$="_0"]').addClass('in active');
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
    tab.find('a').text(idx + 1);
    tab.insertBefore(plus_tab);

    var new_textbox = $('.tab-pane').first().clone();
    new_textbox.removeClass('active');
    new_textbox.attr('id', row_idx + '_' + idx);
    new_textbox.find('textarea').val('');
    var prev_idx = idx-1;
    new_textbox.insertAfter($("#" + row_idx + "_" + prev_idx));
}


$(document).on('click', '.clear', function(){
    $(this).parent().parent().find('.tab-pane.fade.in.active').find('textarea').val('');
});

$(document).on('click', '.remove', function(){
    var row = $(this).parent().parent();
    var idx = row.find('.s_tab.active a').attr('href');
    var row_idx = idx.substr(1, idx.indexOf('_') - 1);
    idx = idx.substr(idx.indexOf('_') + 1, idx.length - 1);
    if (idx > 0){
        idx--;
    } else {
        idx = 1
    }

    if (row.find('.s_tab').length > 1) {
        row.find('.s_tab.active').remove();
        row.find('.tab-pane.fade.in.active').remove();

        var tag = "#" + row_idx + "_" + idx;
        row.find('.s_tab a[href="' + tag + '"]').parent().addClass('active');
        row.find(tag).addClass('in active');
        renumber(row, row_idx);
    }

});


function renumber(row, row_idx){
    var idx = 0;
    row.find('.s_tab').each(function() {
        tag = "#" + row_idx + "_" + idx;
        $(this).find('a').attr('href', tag);
        $(this).find('a').text(idx + 1);
        idx++;
    });

    var idx = 0;
    row.find('.tab-pane').each(function(){
        tag = row_idx + "_" + idx;
        $(this).attr('id', tag);
        idx++;
    });
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




