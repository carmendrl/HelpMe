class AddAssignedToToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :assigned_to_id, :uuid
  end
end
