class CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :find_course!, except: [:index, :create]

  def index
    render json: Course.all, each_serializer: CourseSerializer
  end

  def create
    if current_user.is_a?(Professor)
      permitted_params = course_params.merge!({ instructor_id: current_user.id })
      course = Course.create!(permitted_params)
      render json: course
    else
      render_cannot_perform_operation("Must be a professor to create a course.")
    end
  end

  def update
    if current_user.is_a?(Professor)
      @course.update!(course_params)
      render json: @course
    else
      render_cannot_perform_operation("Must be a professor to update a course.")
    end
  end

  def show
    render json: @course
  end

  def destroy
    if current_user.is_a?(Professor)
      @course.destroy!
      head :no_content, status: 204
    else
      render_cannot_perform_operation("Must be a professor to delete a course.")
    end
  end

  private

  def course_params
    params.permit(:title, :subject, :number, :semester, :instructor_id)
  end

  def find_course!
    @course = Course.find(params[:id])
  end
end
