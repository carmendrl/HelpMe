class Question < ApplicationRecord
  belongs_to :original_asker, class_name: "User"
  has_and_belongs_to_many :askers, through: :questions_users, class_name: "User"
  belongs_to :lab_session
  has_one :answer, :dependent => :destroy

  belongs_to :claimed_by, class_name: "User", optional: true

  validates_presence_of :text

  def claim(user)
    self.claimed_by = user
  end

  def claimed?
    claimed_by.present?
  end
end
