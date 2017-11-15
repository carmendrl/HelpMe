class User < ActiveRecord::Base
  has_many :questions, foreign_key: :asker_id
  has_many :lab_session_memberships
  has_many :lab_sessions, through: :lab_session_memberships, inverse_of: :users

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
