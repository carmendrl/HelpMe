class CreateTags < ActiveRecord::Migration[5.1]
  def change
    create_table :tags do |t|
      t.string  :name, null: false, default: ""
      t.boolean :global, null: false, default: false

      t.timestamps
    end
  end
end
