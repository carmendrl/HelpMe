class LabSessionSerializer < ActiveModel::Serializer
  attribute :description
  attribute :token
  attribute :active
end
