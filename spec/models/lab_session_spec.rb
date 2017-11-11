require 'rails_helper'

RSpec.describe LabSession, type: :model do
  describe "valdiations" do
    before { create(:lab_session) }

    it { is_expected.to validate_uniqueness_of(:token) }
    it { is_expected.to have_many(:questions) }
  end

  it "can create a session" do
    expect do
      create(:lab_session, token: "12345")
    end.to change(LabSession, :count).from(0).to(1)
  end

  it "automatically sets the session token" do
    session = create(:lab_session)

    expect(session.token).not_to be_blank
  end

  it "does not allow two sessions with the same token" do
    sess1 = create(:lab_session, token: "12345")
    sess2 = build(:lab_session, token: "12345")

    expect(sess2).not_to be_valid
    expect(sess2.errors.messages).to eq({
      token: ["has already been taken"],
    })
  end
end
