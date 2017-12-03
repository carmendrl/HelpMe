require "rails_helper"

RSpec.describe Answer do
  describe "relationships" do
    it { is_expected.to belong_to(:answerer) }
    it { is_expected.to belong_to(:question) }
  end

  it "creates an answer" do
    professor = create(:professor)
    lab_session = create(:lab_session)
    question = create(:question, lab_session: lab_session)

    expect do
      answer = create(:answer, question: question, answerer: professor)
    end.to change(Answer, :count).from(0).to(1)
  end
end
