class LabSession < ApplicationRecord
  # Set the number if it hasn't been set already
  before_validation :set_number, on: :create, unless: :number?

  # Ensures that it is a five digit number
  # Only validates on create so that we can set it to nil later once a session is over
  validates_length_of :number, is: 5, on: :create
  # Also validates that the number is unique
  validates_uniqueness_of :number

  private

  def set_number
    # Generates a random number between 9999 and 100000
    num = 10_000 + Random.new.rand(89_999)
    # Ensures that no other session already has the number (it is unique)
    while LabSession.pluck(:number).include?(num) do
      num = 10_000 + Random.new.rand(89_999)
    end
    self.number = num
  end
end
