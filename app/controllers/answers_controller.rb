class AnswersController < ApplicationController
  before_action :authenticate_user!

  def show
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    question = sess.questions.find(params[:question_id])
    render json: question.answer, serializer: AnswerSerializer
  end

  def update
    answer = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:question_id]).answer
    answer.update!(answer_params)

    render json: answer
  end

  def create
    render json: current_user.answers.create!(answer_params)
  end

  def destroy
    answer = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:question_id]).answer

    answer.destroy!
    head :no_content, status: 204
  end

  private

  def answer_params
    params.permit(:text, :question_id)
  end
end
