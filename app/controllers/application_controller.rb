class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :invalid_record

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :type])
  end

  def invalid_record(error)
    render json: {
      error: {
        type: "resource_invalid",
        errors: serialize_errors(error.record),
      }
    }, status: 422
  end

  def not_found(error)
    render json: {
      error: {
        type: "resource_not_found",
        message: error.message.underscore.humanize,
      },
    }, status: 404
  end

  def serialize_errors(resource)
    resource.errors.map do |attribute, message|
      {
        attribute: attribute,
        message: message,
      }
    end
  end
end
