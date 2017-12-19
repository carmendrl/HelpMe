class AddQuestionsUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :questions_users, id: false do |t|
      t.uuid :question_id
      t.uuid :user_id
    end
  end
end
