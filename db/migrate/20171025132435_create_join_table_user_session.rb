class CreateJoinTableUserSession < ActiveRecord::Migration[5.1]
  def change
    create_table :lab_session_memberships do |t|
      t.uuid :user_id, null: false
      t.uuid :lab_session_id, null: false
      t.timestamps
    end
  end
end
