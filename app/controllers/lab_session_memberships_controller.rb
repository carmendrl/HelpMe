class LabSessionMembershipsController < ApplicationController
  before_action :authenticate_user!

  def create
    sess = LabSession.find_by!(token: params[:token])
    membership = LabSessionMembership.find_or_create_by!(user_id: current_user.id, lab_session_id: sess.id)
    render json: membership
  end
end
