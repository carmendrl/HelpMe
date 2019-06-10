class ChangeStepToString < ActiveRecord::Migration[5.1]
  def up
    change_column :questions, :step, :string
  end

  def down
    change_column :questions, :step, :integer
end
