FactoryGirl.define do
  factory :answer do
    text "Here is an answer"
    association :answerer
    association :question
  end
end
