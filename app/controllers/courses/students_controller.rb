class Courses::StudentsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_course!

  def create
    @course.users << current_user
    @course.save!

    head :no_content, status: 204
  end

  def destroy
    user = User.find(params[:id])
    remove_student = DeleteCourseStudents.call(current_user: current_user, user: user, course: @course)

    if remove_student.success?
      head :no_content, status: 204
    else
      render_cannot_perform_operation(remove_student.message)
    end
  end

  private

  def find_course!
    @course = Course.find(params[:course_id])
  end
end
