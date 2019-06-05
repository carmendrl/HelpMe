class AddStepToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :step, :integer
  end
end
