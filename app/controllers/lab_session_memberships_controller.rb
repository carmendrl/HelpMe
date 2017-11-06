class LabSessionMembershipsController < ApplicationController
  before_action :authenticate_user!

  def create
    sess = LabSession.find_by(token: params[:token])
    if sess.present?
      membership = LabSessionMembership.create(user_id: current_user.id, lab_session_id: sess.id)
      render json: membership
    else
      render json: {
        status: 404,
        error: {
          type: "resource_not_found",
          errors: [],
        }
      }
    end
  end
end
