class CreateCourses < ActiveRecord::Migration[5.1]
  def change
    create_table :courses, id: :uuid do |t|
      t.string  :title, null: false, default: ""
      t.string  :subject, null: false, default: ""
      t.string  :number, null: false, default: ""
      t.string  :semester, null: false, default: ""

      t.uuid   :instructor_id

      t.timestamps
    end
  end
end
