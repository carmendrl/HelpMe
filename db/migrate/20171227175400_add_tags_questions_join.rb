class AddTagsQuestionsJoin < ActiveRecord::Migration[5.1]
  def change
    create_table :questions_tags, id: false do |t|
      t.integer :tag_id
      t.uuid    :question_id
    end
  end
end
