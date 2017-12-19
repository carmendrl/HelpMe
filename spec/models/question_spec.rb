require "rails_helper"

RSpec.describe Question do
  describe "validations" do
    it { is_expected.to validate_presence_of(:text) }

    it { is_expected.to have_and_belong_to_many(:askers) }
    it { is_expected.to belong_to(:original_asker) }
    it { is_expected.to belong_to(:claimed_by) }
    it { is_expected.to belong_to(:lab_session) }
  end

  it "creates a question" do
    expect do
      create(:question, text: "Why is abbreviated such a long word?")
    end.to change(Question, :count).from(0).to(1)
  end

  describe "#claimed?" do
    it "returns true if the question has been claimed" do
      user = create(:professor)
      question = create(:question, claimed_by: user)

      expect(question.claimed?).to eq(true)
    end

    it "returns false if the question has not been claimed" do
      question = create(:question, claimed_by: nil)
      expect(question.claimed?).to eq(false)
    end
  end
end
