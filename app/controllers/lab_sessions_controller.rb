class LabSessionsController < ApplicationController
  before_action :authenticate_user!

  def create
    sess = LabSession.new
    if sess.update!(session_params)
      render json: sess
    else
    end
  end

  private

  def session_params
    params.permit(:description, :token, :active)
  end
end
