FactoryGirl.define do
  factory :tag do
    name "Safety"
    global false

    trait :global do
      global true
    end
  end
end
