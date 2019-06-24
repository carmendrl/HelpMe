class UserSerializer < ActiveModel::Serializer
  attribute :email
  attribute :username
  attribute :role
  attribute :first_name
  attribute :last_name
  attribute :toBeNotified
end
