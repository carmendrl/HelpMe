require "rails_helper"

RSpec.describe Question do
  it "creates a question" do
    expect do
      create(:question, text: "Why is abbreviated such a long word?")
    end.to change(Question, :count).from(0).to(1)
  end
end
