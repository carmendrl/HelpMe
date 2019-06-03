class AddFaqToQuestions < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :faq, :boolean, null: false, default: false
  end
end
