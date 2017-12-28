class QuestionsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_question!, except: [:index, :create]

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
    @question.save!

    render json: @question
  end

  def tags
    render json: tag_json(@question.tags)
  end

  def add_tag
    @question.tags << Tag.find_by!(name: params[:tag])
    render json: tag_json(@question.tags)
  end

  def remove_tag
    tag = @question.tags.find_by!(name: params[:tag])
    @question.tags.delete(tag)
    @question.save!

    render json: tag_json(@question.tags)
  end

  private

  def question_params
    params.permit(:text, :lab_session_id, :claimed_by_id)
  end

  def find_question!
    @question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])
  end
end
