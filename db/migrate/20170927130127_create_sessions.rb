class CreateSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :lab_sessions, id: :uuid do |t|
      t.string   :token, null: false
      t.string   :description, null: false, default: ""
      t.boolean  :active, default: true

      t.timestamps
    end
  end
end
