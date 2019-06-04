class CreatePromotionRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :promotion_requests, id: :uuid do |t|
			t.uuid :user_id, null:false
			t.uuid :promoted_by_id, null:false
			t.datetime :expires_on
			t.datetime :confirmed_on
      t.timestamps
    end
  end
end
