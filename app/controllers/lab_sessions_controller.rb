class LabSessionsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_lab_session!, except: [:index, :create]

  def index
    render json: current_user.lab_sessions, each_serializer: LabSessionSerializer
  end

  def show
    render json: @lab_session
  end

  def show_with_users
    render json: @lab_session, meta: get_users
  end

  def get_users
    user_list = {}
    
    @lab_session.users.each do |user|
      user_list[user.email] = user.id
    end
    return user_list
  end

  def create
    lab_session = current_user.lab_sessions.create!(session_params)
    render json: lab_session
  end

  def update
    @lab_session.update!(session_params)

    render json: @lab_session
  end

  def destroy
    # If the user is a prof or the current user is the only one
    if current_user.professor? || @lab_session.users.count == 1
      @lab_session.destroy!
      head :no_content
    else
      render_cannot_perform_operation("This user must be the only user on the lab session")
    end
  end

  private

  def session_params
    params.permit(:description, :token, :active)
  end

  def find_lab_session!
    @lab_session = current_user.lab_sessions.find(params[:id])
  end
end
