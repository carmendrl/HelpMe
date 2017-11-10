class LabSession < ApplicationRecord
  has_many :questions

  # Set the token (alpha/numeric) if it hasn't been set already
  before_validation :set_token, on: :create, unless: :token?

  # Ensure that token is set
  validates_presence_of :token

  # Also validates that the number is unique
  validates_uniqueness_of :token

  private

  def set_token
    token = loop do
      token = SecureRandom.hex[0, 6]
      break token unless LabSession.pluck(:token).include?(token)
    end
    self.token = token
  end
end
