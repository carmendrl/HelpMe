class Question < ApplicationRecord
  belongs_to :asker, class_name: "User"
  belongs_to :lab_session

  belongs_to :claimed_by, class_name: "User", optional: true

  validates_presence_of :text

  def claim(user)
    self.claimed_by = user
  end

  def claimed?
    claimed_by.present?
  end
end
