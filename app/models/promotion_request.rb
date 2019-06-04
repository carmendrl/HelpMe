class PromotionRequest < ApplicationRecord

  belongs_to :user
	belongs_to :promoted_by, class_name: "User"

end
