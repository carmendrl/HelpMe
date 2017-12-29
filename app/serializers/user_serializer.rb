class UserSerializer < ActiveModel::Serializer
  attribute :email
  attribute :username
  attribute :role
end
