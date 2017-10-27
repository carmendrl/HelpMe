class RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    super do |resource|
      headers.merge! resource.create_new_auth_token
      render json: resource
      return
    end
  end
end
