class RegistrationsController < DeviseTokenAuth::RegistrationsController
  before_action :authenticate_user!, only: :show

  def show
    render json: User.find(params[:user_id])
  end

  def render_create_success
    render json: @resource
  end
end
