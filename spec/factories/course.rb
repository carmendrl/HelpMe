FactoryGirl.define do
  factory :course do
    title "Senior Project"
    subject "CSCI"
    number "481"
    semester "201801"
    association :instructor
  end
end
