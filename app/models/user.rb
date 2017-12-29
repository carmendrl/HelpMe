class User < ApplicationRecord
  ROLES = [
    "none",
    "ta",
  ].freeze

  has_many :lab_session_memberships
  has_many :lab_sessions, through: :lab_session_memberships, inverse_of: :users
  has_many :claimed_questions, foreign_key: :claimed_by_id, class_name: "Question"
  has_many :assigned_questions, foreign_key: :assigned_to_id, class_name: "Question"
  has_many :answers, foreign_key: :answerer_id

  has_and_belongs_to_many :courses, through: :courses_users, inverse_of: :users
  has_and_belongs_to_many :questions_asked, class_name: "Question", through: :questions_users
  # Include default devise modules.

  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          #:confirmable,
          :omniauthable
  include DeviseTokenAuth::Concerns::User

  validates_inclusion_of :role, in: ROLES

  before_create :set_role_to_none

  def professor?
    is_a?(Professor)
  end

  def ta?
    self.role == "ta"
  end

  def set_role(new_role = :none)
    self.role = new_role
  end

  private

  def set_role_to_none
    set_role unless self.role == "ta"
  end
end
