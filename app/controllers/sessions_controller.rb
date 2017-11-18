class SessionsController < DeviseTokenAuth::SessionsController
  def create
    super do |resource|
      # If we are able to get here, we know that the user
      # should be signed in. However, it doesn't create
      # the headers properly
      headers.merge! resource.create_new_auth_token
      render json: resource
      return
    end
  end
end
