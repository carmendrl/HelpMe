class AddDatesToLabSessions < ActiveRecord::Migration[5.1]
  def change
    add_column :lab_sessions, :start_date, :datetime, null: false, default: -> { 'CURRENT_TIMESTAMP' }
		add_column :lab_sessions, :end_date, :datetime, null: false, default: -> { 'CURRENT_TIMESTAMP' }
	end
end
