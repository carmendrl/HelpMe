class User < ApplicationRecord
  has_many :lab_session_memberships
  has_many :lab_sessions, through: :lab_session_memberships, inverse_of: :users

  has_many :questions_asked, foreign_key: :asker_id, class_name: "Question"
  has_many :questions_claimed, foreign_key: :claimed_by_id, class_name: "Question"

  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          #:confirmable,
          :omniauthable
  include DeviseTokenAuth::Concerns::User

  def professor?
    is_a?(Professor)
  end
end
