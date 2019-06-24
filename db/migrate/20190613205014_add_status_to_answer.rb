class AddStatusToAnswer < ActiveRecord::Migration[5.1]
  def change
    add_column :answers, :status, :string, null: false, default: "draft"
    add_column :answers, :submitted, :boolean, null: false, default: false
  end
end
