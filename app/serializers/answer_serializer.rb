class AnswerSerializer < ActiveModel::Serializer
  attribute :text
  attribute :created_at
  has_one :answerer, serializer: UserSerializer
end
