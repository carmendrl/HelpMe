class RootController < ApplicationController
  def index
    render json: { message: "Looks good!" }, status: :ok
  end
end
