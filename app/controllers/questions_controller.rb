class QuestionsController < ApplicationController
  before_action :authenticate_user!

  def index
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    render json: sess.questions.order(created_at: :asc), each_serializer: QuestionSerializer
  end

  def show
    question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])
    render json: question
  end

  def update
    question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])
    question.update!(question_params)

    render json: question
  end

  def create
    approved_params = question_params.merge!({ original_asker_id: current_user.id })
    render json: current_user.questions_asked.create!(approved_params)
  end

  def destroy
    question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])

    if question.askers.count == 1 # The only person is the current user
      question.destroy!
      head :no_content, status: 204
    else
      render json: {
        error: {
          type: "cannot_perform_operation",
          message: "This user must be the only one that has hasked this question",
        },
      }, status: 405
    end
  end

  def claim
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    question = sess.questions.find(params[:id])
    question.claim(current_user)
    question.save!

    render json: question
  end

  private

  def question_params
    params.permit(:text, :lab_session_id, :claimed_by_id)
  end
end
