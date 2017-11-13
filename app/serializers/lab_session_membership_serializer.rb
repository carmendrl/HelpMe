class LabSessionMembershipSerializer < ActiveModel::Serializer
  attribute :created_at

  has_one :lab_session
  has_one :user
end
