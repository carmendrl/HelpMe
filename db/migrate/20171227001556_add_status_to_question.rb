class AddStatusToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :status, :string, null: false, default: "pending"
  end
end
