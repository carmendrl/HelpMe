class LabSession < ApplicationRecord
  has_many :questions
  has_many :lab_session_memberships
  has_many :users, through: :lab_session_memberships, inverse_of: :lab_sessions

  belongs_to :course, required: false

  # Set the token (alpha/numeric) if it hasn't been set already
  before_validation :set_token, on: :create, unless: :token?

  # Ensure that token is set
  validates_presence_of :token

  # Also validates that the token is unique
  validates_uniqueness_of :token, case_sensitive: true

  private

  def set_token
    token = loop do
      token = SecureRandom.hex[0, 6]
      break token unless LabSession.pluck(:token).include?(token)
    end
    self.token = token
  end
end
