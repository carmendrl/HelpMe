class LabSessionMembership < ApplicationRecord
  validates_uniqueness_of :user_id, scope: :lab_session_id

  belongs_to :lab_session
  belongs_to :user
end
