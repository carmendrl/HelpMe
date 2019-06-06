class ChangeAnswerType < ActiveRecord::Migration[5.1]
  def up
    change_column :answers, :text, :text
  end

  def down
    change_column :answers, :text, :string
  end
end
