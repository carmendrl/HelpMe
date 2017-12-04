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
    question.update!(questions_params)

    render json: question
  end

  def create
    render json: current_user.questions_asked.create!(questions_params)
  end

  def destroy
    question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:id])

    question.destroy!
    head :no_content, status: 204
  end

  def claim
    sess = current_user.lab_sessions.find_by!(id: params[:lab_session_id])
    question = sess.questions.find_by!(id: params[:id])
    question.claim(current_user)
    question.save!

    render json: question
  end

  private

  def questions_params
    params.permit(:text, :lab_session_id, :claimed_by_id)
  end
end
