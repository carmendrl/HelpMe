FactoryGirl.define do
  factory :course do
    title "Senior Project"
    subject "CSCI"
    number "481"
    semester "201801"
    association :instructor

    trait :with_tags do
      tags { build_list(:tag, 2) }
    end
  end
end
