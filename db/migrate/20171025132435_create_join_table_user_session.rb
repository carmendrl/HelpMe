class CreateJoinTableUserSession < ActiveRecord::Migration[5.1]
  def change
    create_join_table :users, :lab_sessions do |t|
      t.uuid :user_id
      t.uuid :lab_session_id
      t.timestamps
      t.index [:user_id, :lab_session_id]
    end
  end
end
