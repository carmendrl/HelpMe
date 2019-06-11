class StaticPagesController < ActionController::Base
  def index
    render file: Rails.configuration.home_page_path
  end
end
