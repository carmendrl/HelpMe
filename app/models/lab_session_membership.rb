class LabSessionMembership < ApplicationRecord
  belongs_to :lab_session
  belongs_to :user
end
