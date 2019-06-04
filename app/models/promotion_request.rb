class PromotionRequest < ApplicationRecord

	before_create do
		self.expires_on = DateTime.current + 7
	end

  belongs_to :user
	belongs_to :promoted_by, class_name: "User"

  validates_each :user do |record, attribute, value|
    if PromotionRequest
			.where(:user_id => record.user_id)
			.where("expires_on > ?", DateTime.current )
			.any?
			puts "Tried to create new request when non-expired one already exists"
      record.errors.add(attribute, "user already has unexpired promotion request")
		else
			puts "No existing requests.  Creating ..."
		end
	end
end
