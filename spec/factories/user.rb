FactoryGirl.define do
  factory :professor do
    sequence(:email) { |n| "professor#{n}@example.com" }
    username "Ferzle"
    password "password"
    password_confirmation "password"
  end

  factory :student do
    sequence(:email) { |n| "student#{n}@example.com" }
    username "Buttercup"
    password "password"
    password_confirmation "password"
  end
end
