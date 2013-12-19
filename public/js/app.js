//MODELS
var Post = Backbone.Model.extend({
        url: '/api/posts'
});
var post = new Post({
        title: "Post Title", 
        body: "Put profound stuff here."
});

//VIEWS
var PostView = Backbone.View.extend({
        tagName: "div", //div is the default
        className: "row",
        template: _.template(post_index_tpl),
        render: function () {
                this.$el.html(this.template(this.model.attributes));

                $.getJSON('/api/posts', function(data){
                  $.each(data, function(k, v){
                    var posted_time = v.created_at
                    var timezone = Intl.DateTimeFormat().resolved.timeZone;
                    var s = moment(posted_time).tz(timezone).format("MMMM Do YYYY, h:mm a");
                    $('.dateTime').each(function(){
                      $(this).text(s);
                    })
                  })
                })

                return this;
        },
        events: {
          "click .read-more" : "open"
        },
        open: function () {
          RubyCms.navigate("post/" + this.model.id, true);
        }
});

var PostDetailView = PostView.extend({
        className: "box detail",
        events: {
                "click" : "edit"
        },
        edit: function () {
                RubyCms.navigate("post/" + this.model.id + "/edit", true);
        }
});

var PostEditView = PostView.extend({
        className: "box edit",
        events: {
                "click .save-button" : "save"
        },
        template: _.template(edit_post_tpl),
        save: function () {        
                //this.model.save(array of changed attributes);
        }
});

//COLLECTIONS
var PostList = Backbone.Collection.extend({
        model: Post,
        url: '/api/posts',
        parse: function (response) {
                return response;
        },
});

var posts = new PostList( [{title: "Accomplishments", body: "Met Sales Goals, Improved Hiring Process"},
  {title: "Shopping List", body: "Egg, Bacon, Milk, Toilet Paper"},
  {title: "HH Quote", body: "Education is the way to achieve far-reaching results, it is the proper way to promote compassion and tolerance in society."}]);


//COLLECTION VIEW
var PostListView = Backbone.View.extend({
        initialize: function () {
                this.collection.on('add', this.addOne, this);
        },
        render: function () {
                this.collection.forEach(this.addOne, this);
        },
        addOne: function (post) {
                var postView = new PostView({model: post});
                this.$el.append(postView.render().el);
        }

});
var postsView = new PostListView({collection: posts});


//ROUTERS
var RubyCms = new (Backbone.Router.extend({
        routes: {
                "":"index", 
                "/api/post/:id": "show",
                "/api/post/:id/edit": "edit"},
        initialize: function () {
                this.postList = new PostList();
                this.postList.on('reset', function () {
                        RubyCms.postListView = new PostListView({collection: RubyCms.postList});
                        RubyCms.postListView.render();
                        $("#app").html(RubyCms.postListView.el);
                });
                this.clearAlerts
                this.postList.fetch({reset: true});
        },
        start: function () {
                Backbone.history.start({pushState: true});
        },
        index: function () {
                //default view
        },
        show: function (id) {
                var postView = new PostDetailView({model: this.postList.get(id)});
                $("#app").html(postView.render().el);
        },
        edit: function (id) {
                var postView = new PostEditView({model: this.postList.get(id)});
                $("#app").html(postView.render().el);
        },
        clearAlerts: function(){
            window.setTimeout(function() {
              $(".alert").fadeTo(4500, 0).slideUp(500, function(){
                  $(this).remove();
              });
          }, 4000);
        }
}));

$(function(){
    RubyCms.start();
});