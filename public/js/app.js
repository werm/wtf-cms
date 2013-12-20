var app = app || {};

$(function() {
    new app.PostsView();

    $(":file").filestyle({
        classButton: "btn btn-default",
        buttonText: "Add Image",
        icon: false
      });

    timeNow = $.now();

    $('#published_at').val(timeNow)
});