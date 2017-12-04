class CreateAnswers < ActiveRecord::Migration[5.1]
  def change
    create_table :answers, id: :uuid do |t|
      t.string :text, default: ""
      t.uuid :answerer_id
      t.uuid :question_id

      t.timestamps
    end
  end
end
