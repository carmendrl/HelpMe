class Student < User
  include DeviseTokenAuth::Concerns::User
end
