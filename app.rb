require 'sinatra'
require 'sinatra/base'
require "sinatra/reloader" if development?
require 'sinatra/json'
require 'json'
require 'sinatra/activerecord'
require './environment'
require 'sinatra/flash'
require 'sinatra/redirect_with_flash'
require 'date'
require 'time'

enable :sessions

configure :development do
  register Sinatra::Reloader
end

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

# API Structure
#############
# URL               Method    Operation
# /api/posts        GET         Get an array of all books
# /api/posts/:id   GET        Get the book with id of :id
# /api/posts        POST       Add a new book and return the book with an id attribute added
# /api/posts/:id   PUT         Update the book with id of :id
# /api/posts/:id  DELETE     Delete the book with id of :id

#############
# API
#############

get "/api/posts" do
  @posts = Post.order("created_at DESC").to_json
end

get "/api/posts/:id" do
  @post = Post.find(params[:id]).to_json
end

post "/api/posts" do
  content_type :json
  params_json = JSON.parse(request.body.read)

  @post = Post.new(params_json)

  if @post.save
    @post.to_json
    puts "OK \n Post: \n #{@post.to_json}"
  else
    {:error => "Nok"}.to_json
    puts "NOkay \n #{@post.to_json}"
  end

end

put '/api/posts/:id' do
  # edit stuff
  # @post = Post.find(params[:id])
  # @post.update(params[:post])
  # redirect "/posts/#{@post.id}"
end

delete '/api/posts/:id' do
  content_type :json
  @post = Post.find(params[:id])

  if @post.destroy
    {:success => "ok"}.to_json
  else
    halt 500
  end
end

# create new post
get "/posts/create" do
  @title = "Create post"
  @post = Post.new
  erb :"posts/create"
end

post "/posts" do
  @post = Post.new(params[:post])
  if @post.save
    redirect "posts/#{@post.id}", :notice => 'Congrats! Love the new post. (This message will disapear in 4 seconds.)'
  else
    redirect "posts/create", :error => 'Somepost went wrong. Try again. (This message will disapear in 4 seconds.)'
  end
end

# get ALL posts
get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/post/*' do
  File.read(File.join('public', 'index.html'))
end

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