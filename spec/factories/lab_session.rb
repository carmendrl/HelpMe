FactoryGirl.define do
  factory :lab_session do
    description "This is a lab_session"
    association :course
  end
end
