class Question < ApplicationRecord
  STATUSES = [
    "pending",
    "claimed",
    "answered",
    "assigned_to",
  ].freeze

  has_one :answer, dependent: :destroy

  has_and_belongs_to_many :askers, through: :questions_users, class_name: "User"
  has_and_belongs_to_many :tags, through: :questions_tags, inverse_of: :questions

  belongs_to :original_asker, class_name: "User"
  belongs_to :lab_session
  belongs_to :claimed_by, class_name: "User", optional: true
  belongs_to :assigned_to, class_name: "User", optional: true

  validates_presence_of :text
  validates_presence_of :status
  validates_inclusion_of :status, in: STATUSES

  before_validation :update_status!

  def claim(user)
    self.claimed_by = user
    self.save!
  end

  def claimed?
    claimed_by.present?
  end

  def update_status!
    if answer.present?
      self.status = :answered
    elsif assigned_to.present?
      self.status = :assigned_to
    elsif claimed_by.present?
      self.status = :claimed
    else
      self.status = :pending
    end
  end
end
