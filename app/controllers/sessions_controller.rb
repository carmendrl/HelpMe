class SessionsController < DeviseTokenAuth::SessionsController
  def render_create_success
    update_auth_header
    render json: @resource
  end
end
