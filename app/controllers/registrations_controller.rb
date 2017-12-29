class RegistrationsController < DeviseTokenAuth::RegistrationsController
  before_action :authenticate_user!, only: [:show, :promote, :demote]

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
end
