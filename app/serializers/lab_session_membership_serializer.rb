class LabSessionMembershipSerializer < ActiveModel::Serializer
  has_one :lab_session
  has_one :user
  attribute :created_at
end
