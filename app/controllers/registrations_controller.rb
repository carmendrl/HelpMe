class RegistrationsController < DeviseTokenAuth::RegistrationsController
  def render_create_success
    render json: @resource
  end
end
