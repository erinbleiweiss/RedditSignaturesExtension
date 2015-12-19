var signatures = {};

$("#onoff").click(function(){
    console.log($("#onoff").checked)
});


chrome.storage.sync.get({
    signatures: {}
}, function(items){
    signatures = items.signatures;
    $.each(items.signatures, function(idx, obj) {
        if (idx == 0){
            //$(document).find('.toggle_row').first().hide();
            $(document).find('.toggle_row').first().find('h5').text("/r/" + this.subreddit);
            if (this.active){
                $(document).find('.toggle_row').first().find('#toggle_' + idx).prop('checked', true);
            } else {
                $(document).find('.toggle_row').first().find('#toggle_' + idx).prop('checked', false);
            }
        } else{
            var last = $(document).find('.toggle_row').last();
            var clone = last.clone();
            clone.show();
            clone.insertAfter(last);
            clone.find('input').attr('id', 'toggle_' + idx);
            clone.find('h5').text("/r/" + this.subreddit);
            if (this.active){
                console.log('active');
                clone.find('#toggle_' + idx).prop('checked', true);
            } else {
                clone.find('#toggle_' + idx).prop('checked', false);
            }
        }
    });
});



$(document).on('change', '.toggle-elm', function() {
    var checked = $(this).prop('checked');
    var idx = $(this).attr('id');
    idx = idx.substr(idx.indexOf('_') + 1, idx.length-1);

    $.each(signatures, function(i, obj) {
        if (i == idx){
            signatures[i]['active'] = checked;
        }
    });

    chrome.storage.sync.set({
        signatures: signatures
    }, function(){

    });


});

