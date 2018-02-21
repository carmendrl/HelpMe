class LabSessionSerializer < ActiveModel::Serializer
  attribute :description
  attribute :token
  attribute :active
  attribute :course_id
  
  has_many :questions
  has_many :users
end
