require "rails_helper"

RSpec.describe Question do
  describe "validations" do
    it { is_expected.to validate_presence_of(:text) }

    it { is_expected.to belong_to(:asker) }
    it { is_expected.to belong_to(:lab_session) }
  end

  it "creates a question" do
    expect do
      create(:question, text: "Why is abbreviated such a long word?")
    end.to change(Question, :count).from(0).to(1)
  end
end
