class CreateStudentsCoursesJoinTable < ActiveRecord::Migration[5.1]
  def change
    create_table :courses_users, id: false do |t|
      t.uuid :user_id
      t.uuid :course_id
    end
  end
end
