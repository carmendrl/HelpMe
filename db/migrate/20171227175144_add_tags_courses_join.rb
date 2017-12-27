class AddTagsCoursesJoin < ActiveRecord::Migration[5.1]
  def change
    create_table :courses_tags, id: false do |t|
      t.integer :tag_id
      t.uuid    :course_id
    end
  end
end
