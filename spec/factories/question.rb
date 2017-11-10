FactoryGirl.define do
  factory :question do
    text "Can I ask a question?"
    association :asker
    association :lab_session
  end
end
