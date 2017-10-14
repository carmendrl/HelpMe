class LabSession < ApplicationRecord
  # Set the token (alpha/numeric) if it hasn't been set already
  before_validation :set_token, on: :create, unless: :token?

  # Ensures that it is a five digit number
  # Only validates on create so that we can set it to nil later once a session is over
  validates_length_of :token, is: 5, on: :create
  # Also validates that the number is unique
  validates_uniqueness_of :token

  private

  def set_token
    # Generates a random number between 9999 and 100000
    token = (10000 + Random.new.rand(89999)).to_s
    # Ensures that no other session already has the number (it is unique)
    while LabSession.pluck(:token).include?(token) do
      token = (10000 + Random.new.rand(89999)).to_s
    end
    self.token = token
  end
end
