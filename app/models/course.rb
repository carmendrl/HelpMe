class Course < ApplicationRecord
  has_many :lab_sessions

  has_and_belongs_to_many :tags, through: :courses_tags, inverse_of: :courses
  has_and_belongs_to_many :users, through: :courses_users, inverse_of: :courses

  belongs_to :instructor, class_name: "Professor", required: false

  validates_format_of :semester, with: /\A20\d{4}\z/
  validates_presence_of :title
  validates_presence_of :subject
  validates_presence_of :number
  validates_presence_of :semester
end
