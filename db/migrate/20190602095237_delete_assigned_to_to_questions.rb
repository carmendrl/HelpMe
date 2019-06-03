class DeleteAssignedToToQuestions < ActiveRecord::Migration[5.1]
  def change
    remove_column :questions, :assigned_to_id, :uuid
  end
end
