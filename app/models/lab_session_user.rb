class LabSessionUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :lab_session
end
