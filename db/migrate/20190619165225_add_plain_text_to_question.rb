class AddPlainTextToQuestion < ActiveRecord::Migration[5.1]
  def change
		add_column :questions, :plaintext, :string, null: true
  end
end
