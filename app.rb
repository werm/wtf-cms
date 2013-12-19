require 'sinatra'
require 'sinatra/activerecord'
require './environment'
require 'sinatra/flash'
require 'sinatra/redirect_with_flash'
require 'date'
require 'time'

enable :sessions

class Post < ActiveRecord::Base
 validates :title, presence: true, length: { minimum: 5 }
 validates :body, presence: true
end

helpers do

  include Rack::Utils
  alias_method :h, :escape_html

  def title
    if @title
      "#{@title}"
    else
      "Welcome."
    end
  end

end # /helpers

###
# API
###

get "/api/posts" do
  @posts = Post.order("created_at DESC").to_json
end

get "/api/posts/:id" do
  @post = Post.find(params[:id]).to_json
end

# create new post
get "/posts/create" do
  @title = "Create post"
  @post = Post.new
  @posted = post_converted_time
  erb :"posts/create"
end

post "/posts" do
  @post = Post.new(params[:post])
  if @post.save
    redirect "posts/#{@post.id}", :notice => 'Congrats! Love the new post. (This message will disapear in 4 seconds.)'
  else
    redirect "posts/create", :error => 'Something went wrong. Try again. (This message will disapear in 4 seconds.)'
  end
end

# get ALL posts
get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/posts/*' do
  File.read(File.join('public', 'index.html'))
end

# # view post
# get "/posts/:id" do
#   @post = Post.find(params[:id])
#   @title = @post.title
#   erb :"posts/view"
# end

# edit post
get "/posts/:id/edit" do
  @post = Post.find(params[:id])
  @title = "Edit Form"
  erb :"posts/edit"
end

put "/posts/:id" do
  @post = Post.find(params[:id])
  @post.update(params[:post])
  redirect "/posts/#{@post.id}"
end