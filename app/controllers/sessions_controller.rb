class SessionsController < ApplicationController
  def create
    sess = Session.new
    if sess.update(session_params)
      render json: sess
    else
      render json: {
        status: 422,
        error: {
          type: "resource_invalid",
          errors: serialize_errors(sess),
        }
      }
    end
  end

  private

  def session_params
    params.permit(:description, :number, :active)
  end

  def serialize_errors(object)
    object.errors.map do |attribute, message|
      {
        attribute: attribute,
        message: message,
      }
    end
  end
end
