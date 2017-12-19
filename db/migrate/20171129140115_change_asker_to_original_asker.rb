class ChangeAskerToOriginalAsker < ActiveRecord::Migration[5.1]
  def change
    rename_column :questions, :asker_id, :original_asker_id
  end
end
