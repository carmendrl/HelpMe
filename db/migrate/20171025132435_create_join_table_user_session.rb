class CreateJoinTableUserSession < ActiveRecord::Migration[5.1]
  def change
    create_join_table :users, :sessions do |t|
      t.uuid :user_id
      t.uuid :session_id
      t.timestamps
      t.index [:user_id, :session_id]
    end
  end
end
