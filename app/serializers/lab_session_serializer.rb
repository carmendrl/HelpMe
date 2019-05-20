class LabSessionSerializer < ActiveModel::Serializer
  attribute :description
  attribute :token
  attribute :active
  attribute :course_id
  attribute :start_date
	attribute :end_date

  has_many :questions
  has_many :users
	has_one :course
end
