require 'rails_helper'

RSpec.describe LabSession, type: :model do
  it "can create a session" do
    expect do
      create(:lab_session, number: 12345)
    end.to change(LabSession, :count).from(0).to(1)
  end

  it "automatically sets the session number" do
    session = create(:lab_session)

    expect(session.number).not_to be_blank
  end

  it "validates that the session number is larger than 9_999 and smaller than 100_000" do
    session = build(:lab_session, number: 9_998)
    expect(session).not_to be_valid
    expect(session.errors.messages).to eq({
      number: ["is the wrong length (should be 5 characters)"],
    })

    session.number = 100_001
    expect(session).not_to be_valid
    expect(session.errors.messages).to eq({
      number: ["is the wrong length (should be 5 characters)"],
    })

    session.number = 23456
    expect(session).to be_valid
  end

  # TODO decide if we are going to allow session numbers to be disassociated from sessions
  it "does not validate the session number on an update" do
    session = create(:lab_session, number: 12345)
    # Expect that it was able to be saved
    expect(session).to be_persisted

    session.number = nil
    expect(session).to be_valid
  end

  it "does not allow two sessions with the same number" do
    sess1 = create(:lab_session, number: 12345)
    sess2 = build(:lab_session, number: 12345)

    expect(sess2).not_to be_valid
    expect(sess2.errors.messages).to eq({
      number: ["has already been taken"],
    })
  end
end
