class CreateQuestions < ActiveRecord::Migration[5.1]
  def change
    create_table :questions, id: :uuid do |t|
      t.string :text, null: false, default: ""
      t.uuid   :asker_id
      t.uuid   :lab_session_id

      t.timestamps
    end
  end
end
