FactoryGirl.define do
  factory :question do
    text "Can I ask a question?"
    association :original_asker
    association :lab_session
    association :claimed_by, factory: :professor

    trait :unclaimed do
      claimed_by nil
    end

    after :create do |q|
      q.askers << q.original_asker
    end
  end
end
