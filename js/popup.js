var signatures = {};

$("#onoff").click(function(){
    console.log($("#onoff").checked)
});


chrome.storage.sync.get({
    signatures: {}
}, function(items){
    signatures = items.signatures;
    if (signatures.length == 0){
        $('.no_sigs2').show();
        $('table').hide();
    }
    $.each(items.signatures, function(idx, obj) {
        $('.no_sigs2').hide();
        $('table').show();
        var last = $(document).find('.toggle_row').last();
        var clone = last.clone();
        if (idx == 0){
            last.hide();
        }
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

