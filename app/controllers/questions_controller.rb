class QuestionsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_question!, except: [:index, :create, :show_user_questions]

  def index
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    render json: sess.questions.order(created_at: :asc), each_serializer: QuestionSerializer
  end

  def show
    render json: @question
  end

  def update
    @question.update!(question_params)

    render json: @question
  end

  def create
    approved_params = question_params.merge!({ original_asker_id: current_user.id })
    render json: current_user.questions_asked.create!(approved_params)
  end

  def destroy
    if @question.askers.count == 1 # The only person is the current user
      @question.destroy!
      head :no_content, status: 204
    else
      render_cannot_perform_operation("This user must be the only one that has asked this question")
    end
  end

  def claim
    @question.claim(current_user)

    render json: @question
  end

  def assign
    user = User.find(params[:user_id])
    if user.ta? || user.professor?
      @question.assign_to(user)

      render json: @question
    else
      render_cannot_perform_operation("User must be a TA in order to assign them a question.")
    end
  end

  def tags
    render json: tag_json(@question.tags)
  end

  def add_tag
    # Finds tags on the question's course with the given tag
    tags = Tag.joins("inner join courses_tags on courses_tags.course_id = '#{@question.lab_session.course.id}' where tags.name = '#{params[:tag]}'") if @question.lab_session.course.present?

    # Puts them together with all of the global ones
    tags += Tag.global

    tags.map { |t| t.name == params[:tag] }
    if tags.any?
      @question.tags << tags.flatten
      render json: tag_json(@question.tags)
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  def remove_tag
    tag = @question.tags.find_by!(name: params[:tag])
    @question.tags.delete(tag)
    @question.save!

    render json: tag_json(@question.tags)
  end

  def show_user_questions
		#  Find all of the questions that this user has asked, either as the original asker, or through the
		#  "Me Too!" mechanism
		questions = Question.joins(:askers).where("user_id = '#{current_user.id}'")
		render json: questions
	end

  private

  def question_params
    params.permit(:text, :lab_session_id, :claimed_by_id)
  end

  def find_question!
    @question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])
  end
end
