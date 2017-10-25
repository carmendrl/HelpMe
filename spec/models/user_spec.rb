require "rails_helper"

RSpec.describe "User" do
  it "is able to create a user" do
    expect do
      create(:user, email: "ferzle@example.com", username: "ferzle", password: "password", password_confirmation: "password")
    end.to change(User, :count).from(0).to(1)
  end
end
