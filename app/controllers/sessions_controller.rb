class SessionsController < DeviseTokenAuth::SessionsController
  def create
    super do |resource|
      render json: resource
      return
    end
  end
end
