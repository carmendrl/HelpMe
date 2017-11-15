FactoryGirl.define do
  factory :lab_session_membership do
    association :user, factory: :student
    association :lab_session
  end
end
