class PromotionRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_request!, except: [:index, :create]

  def index
		if params[:unconfirmed] == 'true'
			render json: PromotionRequest.where(:confirmed_on => nil), include: [:user, :promoted_by]
		else
    	render json: PromotionRequest.all, include: [:user, :promoted_by]
		end
  end

  def create
		user = User.find(params[:user_id])

		if current_user.professor?
				promotion_code = PromotionRequest.create!(
					:user => user,
					:promoted_by => current_user
				)
				render json: promotion_code
		else
			render_cannot_perform_operation("Must be a professor to create a promotion to professor request")
		end
  end

  def update
			@request.confirmed_on = DateTime.current
			@request.promoted_by = current_user
			@request.save!

			@request.user.type = 'Professor'
			@request.user.save!

			PromotionRequestConfirmationMailer.with(request: @request).promotion_request_confirmed.deliver_now
			render json: @request, include: [:user, :promoted_by]
	end

  def show
    render json: @request, include: [:user, :promoted_by]
  end

  def destroy

  end

  private

  def course_params
    params.permit(:title, :subject, :number, :semester, :instructor_id)
  end

  def find_request!
    @request = PromotionRequest.find(params[:id])
  end
end
