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

    render json: answer, include: [:answerer]
  end

  def create
    question = Question.find(params[:question_id])
    answer = current_user.answers.create!(answer_params)

    question.save!

    render json: answer, include: [:answerer]
  end

  def destroy
    question = current_user.lab_sessions.find(params[:lab_session_id]).questions.find(params[:question_id])

    answer = question.answer
    answer.destroy!

    head :no_content, status: 204
  end

  private

  def answer_params
    params.permit(:text, :question_id, :answerer_id)
    params.permit(:text, :question_id, :submitted)
  end
end
