class AskersController < ApplicationController
  def create
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    question = sess.questions.find(params[:question_id])

    question.askers << current_user if !question.askers.include?(current_user)
    render json: question
  end

  def destroy
    sess = current_user.lab_sessions.find(params[:lab_session_id])
    question = sess.questions.find(params[:question_id])

    question.askers.delete(current_user) if question.askers.include?(current_user)

    head :no_content, status: 204
  end
end
