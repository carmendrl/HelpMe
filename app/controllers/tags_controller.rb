class TagsController < ApplicationController
  before_action :authenticate_user!

  def index
    tags = Tag.all
    render json: tag_json(tags)
  end

end
