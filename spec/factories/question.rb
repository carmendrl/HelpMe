FactoryGirl.define do
  factory :question do
    text "Can I ask a question?"
    association :asker
    association :lab_session
    association :claimed_by, factory: :professor

    trait :unclaimed do
      claimed_by nil
    end
  end
end
