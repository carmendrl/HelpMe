class CreateSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :sessions, id: :uuid do |t|
      t.integer  :number, null: false
      t.string   :description
      t.boolean  :active, default: true

      t.timestamps
    end
  end
end
