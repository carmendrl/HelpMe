class Tag < ApplicationRecord
  has_and_belongs_to_many :courses, through: :courses_tags, inverse_of: :tags
  has_and_belongs_to_many :questions, through: :questions_tags, inverse_of: :tags

  validates_presence_of :name
end
