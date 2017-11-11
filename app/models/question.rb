class Question < ApplicationRecord
  belongs_to :asker, class_name: "User"
  belongs_to :lab_session

  validates_presence_of :text
end
