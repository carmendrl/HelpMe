require 'rails_helper'

RSpec.describe LabSession, type: :model do
  it "can create a session" do
    expect do
      create(:lab_session, token: "12345")
    end.to change(LabSession, :count).from(0).to(1)
  end

  it "automatically sets the session token" do
    session = create(:lab_session)

    expect(session.token).not_to be_blank
  end

  it "validates that the session token is larger than 9_999 and smaller than 100_000" do
    session = build(:lab_session, token: "9998")
    expect(session).not_to be_valid
    expect(session.errors.messages).to eq({
      token: ["is the wrong length (should be 5 characters)"],
    })

    session.token = "100_001"
    expect(session).not_to be_valid
    expect(session.errors.messages).to eq({
      token: ["is the wrong length (should be 5 characters)"],
    })

    session.token = "23456"
    expect(session).to be_valid
  end

  # TODO decide if we are going to allow session tokens to be disassociated from sessions
  it "does not validate the session token on an update" do
    session = create(:lab_session, token: "12345")
    # Expect that it was able to be saved
    expect(session).to be_persisted

    session.token = nil
    expect(session).to be_valid
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
