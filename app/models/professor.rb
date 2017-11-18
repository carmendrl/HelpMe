class Professor < User
  include DeviseTokenAuth::Concerns::User
end
