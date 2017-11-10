class User < ActiveRecord::Base
  has_many :questions, foreign_key: :asker_id

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
