class RegistrationsController < DeviseTokenAuth::RegistrationsController
  before_action :authenticate_user!, only: [:show, :promote, :demote]
#  before_filter :sign_up_params!
  def show
    render json: User.find(params[:user_id])
  end

  def promote
    user = User.find(params[:user_id])
    if current_user.professor?
      user.set_role(:ta)
      user.save!

      render json: user
    else
      render_cannot_perform_operation("Must be a professor to promote a student.")
    end
  end

  def demote
    user = User.find(params[:user_id])
    if current_user.professor?
      user.set_role(:none)
      user.save!

      render json: user
    else
      render_cannot_perform_operation("Must be a professor to demote a student.")
    end
  end

  protected

  def render_create_success
    render json: @resource
  end

  def sign_up_params
    params.permit(:first_name, :last_name, :email, :password, :password_confirmation, :username, :type)
  end

end
