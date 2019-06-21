class RegistrationsController < DeviseTokenAuth::RegistrationsController
  #before_action :authenticate_user!, only: [:show, :promote, :demote, :find_user]
  before_action :authenticate_user!, except: [:create]

  #  Create a promotion request if requested
	def create
		super
		if params["requestPromotion"] == 'true'
			user = User.where(:email => params["email"]).first
			PromotionRequest.create!(
				:user => user
			)
		end
	end

	def show
    render json: User.find(params[:user_id])
  end

  def promote
    user = User.find(params[:user_id])
    if current_user.professor?
      user.set_role(:ta)
      user.save!
      CreateTaConfirmationMailer.with(user: user, instructor: current_user).create_ta_confirmed.deliver_now
      render json: user
    else
      render_cannot_perform_operation("Must be a professor to promote a student.")
    end
  end

  def demote
    user = User.find(params[:user_id])
    if current_user.professor?
      user.set_role(:none)
      user.save!

      render json: user
    else
      render_cannot_perform_operation("Must be a professor to demote a student.")
    end
  end

	def find_user
		#find_params
		query = params[:q].downcase
		collection = User

    if (params[:type])
			if (params[:type] == 'student')
				puts "Looking for a student"
				collection = Student
			else
				puts "Looking for a professor"
				collection = Professor
			end
		end

		email_results = collection.where("lower(email) like ?", "%#{query}%")
		first_name_results = collection.where("lower(first_name) like ?", "%#{query}%")
		last_name_results = collection.where("lower(last_name) like ?", "%#{query}%")

		all_results = email_results.or(first_name_results).or(last_name_results)

		render json: all_results
	end

  protected

  def render_create_success
    render json: @resource
  end

  def find_params
		params.permit(:q, :type)
	end

  def sign_up_params
    params.permit(:first_name, :last_name, :email, :password, :password_confirmation, :username, :type)
  end

end
