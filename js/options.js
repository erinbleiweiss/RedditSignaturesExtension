var sig_idx = 0;

// Save data to chrome.storage
function save_options(){
    var signatures = [];
    var hasError = false;
    $('.sub_row').each(function(i, obj) {
        if (i > 0) {
            var data = {};
            var subreddit = $(this).find(".subreddit").val();
            if (subreddit == ""){
                $(this).find('.input-group').addClass('has-error');
                $(this).find('.subreddit[data-toggle="tooltip"]').tooltip('show');
                hasError = true;
            } else{
                $(this).find('.input-group').removeClass('has-error');
                $(this).find('.subreddit[data-toggle="tooltip"]').tooltip('destroy');
            }

            data['active'] = true;
            data['subreddit'] = subreddit;
            if ($(this).find(".random").is(':checked')) {
                data['random'] = true;

                var signature_options = [];
                $(this).find(".signature").each(function (i, obj) {
                    var text = $(this).val();
                    signature_options.push(text);
                });
                data['signature'] = signature_options;

            } else {
                data['random'] = false;
                var signature = $(this).find(".signature").val();
                data['signature'] = signature;
            }

            if ($(this).find('.toggle').hasClass('off')){
                data['active'] = false;
            } else {
                data['active'] = true;
            }

            signatures.push(data);
        }
    });

    if (!hasError) {
        chrome.storage.sync.set({
            signatures: signatures
        }, function () {
            // Update status to let user know options were saved.
            var status = $("#status");
            status.text('Options saved.');
            setTimeout(function () {
                status.text('');
            }, 2000);
        });
    }
}

// Restores options state on page load
// using the preferences stored in chrome.storage.
function restore_options(){
    chrome.storage.sync.get({
        signatures: {}
    }, function(items){
        var random = false;
        $.each(items.signatures, function(idx, val) {
            sig_idx++;
            var row = add_row();
            row.find('.signature').markdown({autofocus:false,savable:false,iconlibrary:'fa'});
            $.each(this, function(k, v) {
                if (k == "subreddit"){
                    row.find(".subreddit").val(v);
                    var preview = row.find(".preview");
                    var html = SnuOwnd.getParser().render(row.find(".signature").val());
                    preview.html(html);
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
                        var preview = row.find(".preview");
                        var html = SnuOwnd.getParser().render(row.find(".signature").val());
                        preview.html(html);
                    }
                }
                else if (k == "active"){
                    if (v == true){
                        row.find('.toggle-elm').bootstrapToggle('on')
                    } else {
                        row.find('.toggle-elm').bootstrapToggle('off')
                    }
                }
            });

        });
        //$(".signature").first().markdown({autofocus:false,savable:false,iconlibrary:'fa'});

        if ($('.sub_row').length > 1){
            $('.no_sigs').hide();
        }

    });
}

$(document).ready(function() {
    $('.sub_row').first().hide();
    restore_options();
});

$("#save").click(function() {
   save_options();
});


// Add new signature (used on page load)
function add_row(){
    var clone = $(".sub_row").first().clone();
    clone.show();
    clone.find(".subreddit").val("");
    clone.find(".signature").val("");
    clone.find(".s_tab a").attr("href", "#" + sig_idx + "_0");
    clone.find(".tab-pane").attr("id", sig_idx + "_0");
    clone.find(".toggle-elm").attr("id", "toggle_" + sig_idx);
    clone.find("#toggle_" + sig_idx).bootstrapToggle('on');
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


// Add new signature (used when plus button is clicked)
$(document).on('click', '.plus', function() {
    sig_idx++;

    if ($(this).parents(':eq(1)').attr('class') == "no_sigs"){
        var row = $(this).parents(':eq(2)').find('.sub_row').first();
        $(this).parents(':eq(1)').hide();
    } else {
        var row = $(this).parents(':eq(1)').closest('.sub_row');
    }

    var clone = $(".sub_row").first().clone();
    clone.show();
    clone.find(".signature").markdown({autofocus:false,savable:false,iconlibrary:'fa'});
    clone.find(".subreddit").val("");
    clone.find(".signature").val("");
    clone.find('.toggle-elm').bootstrapToggle('on');
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

// Remove signature (when minus button is clicked)
$(document).on('click', '.minus', function() {

    if ($(this).parents(':eq(1)').attr('class') != "no_sigs"){
        if ($(".sub_row").length > 1) {
            var row = $(this).parents(':eq(1)').closest('.sub_row');
            row.remove();
        }
    }
    if ($('.sub_row').length == 1){
        $('.no_sigs').show();
    }

});

// Show/hide tabs when "Pick at random" is toggled
$(document).on('change', '.random', function(){
    var row = $(this).parents(':eq(2)');

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

// Display corresponding divs when tab is changed
$(document).on('click', '.nav-tabs a', function(e){
    if (!$(this).hasClass("addtab")){
        $(this).tab('show');
        e.preventDefault();

        var id = $(this).attr('href');
        var preview = $(id).find(".preview");
        var html = SnuOwnd.getParser().render($(id).find(".signature").val());
        preview.html(html);

    } else{
        var tab = $(this).parent();
        addTab(tab);
    }
});


// Add a new tab when tab "plus" button is clicked
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
    new_textbox.find('.signature').markdown({autofocus:false,savable:false,iconlibrary:'fa'});
    new_textbox.removeClass('active');
    new_textbox.attr('id', row_idx + '_' + idx);
    new_textbox.find('textarea').val('');
    var prev_idx = idx-1;
    new_textbox.insertAfter($("#" + row_idx + "_" + prev_idx));
}


// Clear current signature and update preview
$(document).on('click', '.clear', function(){
    $(this).parents(':eq(2)').find('.tab-pane.fade.in.active').find('textarea').val('');
    var preview = $(this).parents(':eq(2)').find('.preview');
    var html = SnuOwnd.getParser().render($(this).val());
    preview.html(html);

});

// Remove current tab
$(document).on('click', '.remove', function(){
    var row = $(this).parents(':eq(1)');
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

// Renumber tabs when tab is removed
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

// Add autocomplete subreddit search for each input
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

// Update preview for every keystroke
$(document).on('input propertychange', '.signature', function (e) {
    var preview = $(this).parents(':eq(2)').find('.preview');
    var html = SnuOwnd.getParser().render($(this).val());
    preview.html(html);
});


// Enable/disable row when toggled on/off
$(document).on('change', '.toggle-elm', function() {

    var row = $(this).parents(':eq(2)');
    if (row.find('.toggle').hasClass('off')){
        row.find('.subreddit').addClass('disabled');
        row.find('.input-group-addon').addClass('disabled');
        row.find('.nav').addClass('disabled');
        row.find('.tab-content').addClass('disabled');
        row.find('.options').addClass('disabled');
    } else{
        row.find('.subreddit').removeClass('disabled');
        row.find('.input-group-addon').removeClass('disabled');
        row.find('.nav').removeClass('disabled');
        row.find('.tab-content').removeClass('disabled');
        row.find('.options').removeClass('disabled');
    }

});

