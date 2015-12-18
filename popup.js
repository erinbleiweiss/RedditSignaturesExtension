$("#onoff").click(function(){
    console.log($("#onoff").checked)
});


chrome.storage.sync.get({
    signatures: {}
}, function(items){
    $.each(items.signatures, function(idx, obj) {
        if (idx == 0){
            $(document).find('.toggle_row').first().find('h5').text("/r/" + this.subreddit);
        } else{
            var last = $(document).find('.toggle_row').last();
            var clone = last.clone();
            clone.insertAfter(last);
            clone.find('input').attr('id', 'toggle_' + idx);
            clone.find('h5').text("/r/" + this.subreddit);
        }
    });
});