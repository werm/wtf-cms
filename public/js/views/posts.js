var app = app || {};

var form = new Backbone.Form({
    model: app.Post
}).render();

$('#postForm').append(form.el);

app.PostsView = Backbone.View.extend({
   
  el: '#posts',

  events:{
    'click .show-post-form':'showForm',
    'click #add':'addPost'
  },

  addPost: function( e ) {
      e.preventDefault();

      var formData = {};

      $( '#addPost div' ).children( 'input', 'textarea' ).each( function( i, el ) {
        console.log("el.val: "+ $(el).val())
          if( $( el ).val() != '' )
          {
              formData[ el.id ] = $( el ).val();
          }
      });

      console.log(formData)
      // this.collection.add( formData )
      this.collection.create( formData );

  },

    initialize: function() {
        this.collection = new app.Posts();
        this.collection.fetch({reset: true}); // NEW
        this.render();

        this.listenTo( this.collection, 'add', this.renderPost );
        this.listenTo( this.collection, 'reset', this.render ); // NEW
    },

    // render posts by rendering each post in its collection
    render: function() {
        this.collection.each(function( item ) {
            this.renderPost( item );
        }, this );
        this.addPostButton();
    },

    // render a post by creating a PostView and appending the
    // element it renders to the posts's element
    renderPost: function( item ) {
        var postView = new app.PostView({
            model: item
        });
        this.$el.append( postView.render().el );
    },

    addPostButton: function(){
      if($('.show-post-form').length === 0){
        $('.addPostButton').append('<button class="btn btn-default show-post-form" type="button">Add a Post!</button>');
      }
    },

    showForm: function(){
      $('.addPost-container').toggleClass('hidden');
    }

});