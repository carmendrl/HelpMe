class PromotionRequestSerializer < ActiveModel::Serializer

  attribute :created_at
	attribute :expires_on
	attribute :confirmed_on
	
  has_one :user
	has_one :promoted_by, serializer: UserSerializer

end
