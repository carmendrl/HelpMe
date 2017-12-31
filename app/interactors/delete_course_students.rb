class DeleteCourseStudents
  include Interactor

  def call
    user = context.user
    current_user = context.current_user
    course = context.course

    if course.users.include?(user)
      if current_user == user || current_user.professor?
        course.users.delete(user)
        course.save!
      else
        context.fail!(message: "Cannot remove this user from the course")
      end
    else
      context.fail!(message: "User is not on that course")
    end
  end
end
