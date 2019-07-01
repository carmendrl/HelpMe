class TagsController < ApplicationController
  before_action :authenticate_user!

  def index
    tags = Tag.all.global
    render json: tag_json(tags)
  end

  def create
    tag = current_user.tags.create!(tag_params);
  end

  def tag_params
    params.permit(:name)
  end
end
