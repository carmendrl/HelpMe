class PromotionRequestsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_request!, except: [:index, :create]

  def index
    render json: PromotionRequest.all
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
		if current_user.id == @request.user.id

			@request.confirmed_on = DateTime.current
			@request.save!

			current_user.type = :Professor
			current_user.save!

			#  We need to re-sign in using a Professor
			#  object rather than the Student object
			#  that was originally signed in to keep
			#  Devise from trying to find the user
			#  as a student
			sign_in Professor.find(current_user.id)

			render json: @request
		else
			render_cannot_perform_operation("Only the user being promoted to a professor can confirm a promotion request")
		end
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
