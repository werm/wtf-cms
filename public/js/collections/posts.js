var app = app || {};

app.Posts = Backbone.Collection.extend({
    model: app.Post,
    url: '/api/posts'
});