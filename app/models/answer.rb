class Answer < ApplicationRecord
  STATUSES = [
    "draft",
    "final"
  ]
  belongs_to :answerer, class_name: "User"
  belongs_to :question

  validates_presence_of :status
  validates_inclusion_of :status, in: STATUSES

  before_validation :update_status!

  def update_status!
    if submitted
      self.status = :final
    else
      self.status = :draft
    end
  end
end
