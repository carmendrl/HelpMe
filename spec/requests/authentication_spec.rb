require "rails_helper"

RSpec.describe "Authentication", type: :request do
  describe "POST /users/sign_in" do
    let!(:url) { "https://example.com/users/sign_in" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }
    let!(:user) { create(:professor, email: "ferzle@example.com", username: "ferzle", password: "password", password_confirmation: "password") }

    it "allows a professor to sign in with valid credentials" do
      sign_in_params = {
        email: "ferzle@example.com",
        password: "password",
      }.to_json

      post(url, params: sign_in_params, headers: good_request_headers)
      expect(response.code).to eq("200")

      user = Professor.find_by(email: "ferzle@example.com")

      expect(json).to eq(
        {
          "data"=> {
            "type"=> "professors",
            "id"=> user.id,
            "attributes"=> {
              "email"=> "ferzle@example.com",
              "username"=> "ferzle",
              "role" => "none",
            }
          }
        }
      )
      expect(signed_in?).to eq(true)
    end

    it "allows a student to sign in with valid credentials" do
      user = create(:student, email: "student@example.com", username: "ferzle", password: "password", password_confirmation: "password")

      sign_in_params = {
        email: "student@example.com",
        password: "password",
      }.to_json

      post(url, params: sign_in_params, headers: good_request_headers)
      expect(response.code).to eq("200")

      user = Student.find_by(email: "student@example.com")

      expect(json).to eq(
        {
          "data"=> {
            "type"=> "students",
            "id"=> user.id,
            "attributes"=> {
              "email"=> "student@example.com",
              "username"=> "ferzle",
              "role" => "none",
            }
          }
        }
      )
      expect(signed_in?).to eq(true)
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

  describe "DELETE /users/sign_out" do
    let!(:url) { "https://example.com/users/sign_out" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }
    let!(:user) { create(:professor, email: "ferzle@example.com", username: "ferzle", password: "password", password_confirmation: "password") }

    it "allows the user to sign out" do
      # Sign the user in
      good_request_headers.merge! sign_in(user)

      delete(url, headers: good_request_headers)
      expect(signed_in?).to eq(false)
      expect(response.code).to eq("200")
      expect(json).to eq(
        {
          "success" => true,
        }
      )
    end

    it "errors if a user is not signed it" do
      # The user will not be signed in
      delete(url, headers: good_request_headers)
      expect(response.code).to eq("404")
      expect(json).to eq(
        {
          "errors"=>[
            "User was not found or was not logged in."
          ]
        }
      )
    end
  end
end
