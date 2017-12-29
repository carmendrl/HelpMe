FactoryGirl.define do
  factory :professor, aliases: [:instructor] do
    sequence(:email) { |n| "professor#{n}@example.com" }
    username "Ferzle"
    password "password"
    password_confirmation "password"
  end

factory :student, aliases: [:original_asker] do
    sequence(:email) { |n| "student#{n}@example.com" }
    username "Buttercup"
    password "password"
    password_confirmation "password"

    trait :ta do
      role "ta"
    end
  end
end
