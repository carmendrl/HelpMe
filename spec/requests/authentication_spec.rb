require "rails_helper"

RSpec.describe "Authentication", type: :request do
  describe "POST /users/sign_in" do
    let!(:url) { "https://example.com/users/sign_in" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }
    let!(:user) { create(:user, email: "ferzle@example.com", username: "ferzle", password: "password", password_confirmation: "password") }

    it "allows a user to sign in with valid credentials" do
      sign_in_params = {
        email: "ferzle@example.com",
        password: "password",
      }.to_json

      post(url, params: sign_in_params, headers: good_request_headers)
      expect(response.code).to eq("200")

      user = User.find_by(email: "ferzle@example.com")

      expect(json).to eq(
        {
          "data"=> {
            "type"=> "users",
            "id"=> user.id,
            "attributes"=> {
              "email"=> "ferzle@example.com",
              "username"=> "ferzle",
            }
          }
        }
      )
    end

    it "does not allow a user to sign in with a bad password" do
      bad_sign_in_params = {
        email: "ferzle@example.com",
        password: "this is a wrong password"
      }.to_json

      post(url, params: bad_sign_in_params, headers: good_request_headers)
      expect(response.code).to eq("401")
      expect(json).to eq(
        {
            "errors"=> [
              "Invalid login credentials. Please try again."
            ]
        }
      )
    end

    it "does not allow a user to sign in with a wrong email" do
      bad_sign_in_params = {
        email: "wrong@example.com",
        password: "password"
      }.to_json

      post(url, params: bad_sign_in_params, headers: good_request_headers)
      expect(response.code).to eq("401")
      expect(json).to eq(
        {
            "errors"=> [
              "Invalid login credentials. Please try again."
            ]
        }
      )
    end
  end

  describe "POST /users/sign_out" do
    let!(:url) { "https://example.com/users/sign_out" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }
    let!(:user) { create(:user, email: "ferzle@example.com", username: "ferzle", password: "password", password_confirmation: "password") }

    before do
      # Sign the user in
      good_request_headers.merge! sign_in(user)
    end

    it "allows the user to sign out" do
      delete(url, headers: good_request_headers)
      expect(signed_in?).to eq(false)
    end
  end
end
