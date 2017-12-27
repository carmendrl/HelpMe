require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe "validations" do
    it { is_expected.to have_and_belong_to_many(:courses) }
    it { is_expected.to have_and_belong_to_many(:questions) }

    it "can create a record" do
      create(:tag)
    end
  end
end
