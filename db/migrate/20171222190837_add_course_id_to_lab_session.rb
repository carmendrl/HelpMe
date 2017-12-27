class AddCourseIdToLabSession < ActiveRecord::Migration[5.1]
  def change
    add_column :lab_sessions, :course_id, :uuid
  end
end
