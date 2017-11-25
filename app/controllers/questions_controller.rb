class QuestionsController < ApplicationController
  before_action :authenticate_user!

  def index
    sess = current_user.lab_sessions.find_by!(id: params[:lab_session_id])
    render json: sess.questions, each_serializer: QuestionSerializer
  end

  def update
    question = current_user.lab_sessions.find_by!(id: params[:lab_session_id]).questions.find_by!(id: params[:id])

    question.update!(questions_params)

    render json: question
  end

  def create
    render json: current_user.questions.create!(questions_params)
  end

  def destroy
    question = current_user.lab_sessions.find_by!(id: params[:lab_session_id]).questions.find_by!(id: params[:id])

    question.destroy!
    head :no_content, status: 204
  end

  private

  def questions_params
    params.permit(:text, :lab_session_id)
  end
end
