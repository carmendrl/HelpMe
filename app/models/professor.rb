class Professor < User
  include DeviseTokenAuth::Concerns::User

  has_many :courses
end
