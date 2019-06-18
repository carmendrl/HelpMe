class AnswerSerializer < ActiveModel::Serializer
  attribute :text
  attribute :created_at
  attribute :status
  attribute :submitted
  has_one :answerer, serializer: UserSerializer
end
