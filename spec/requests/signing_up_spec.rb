require "rails_helper"

RSpec.describe "Signing up", type: :request do
  describe "POST /users" do
    let!(:url) { "https://example.com/users" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }

    it "allows a user to sign up with good parameters" do
      sign_up_params = {
        email: "buttercup@example.com",
        password: "password",
        password_confirmation: "password",
        username: "princess.buttercup",
      }.to_json

      expect do
        post(url, params: sign_up_params, headers: good_request_headers)
      end.to change(User, :count).from(0).to(1)
      expect(response.code).to eq("200")

      user = User.last

      expect(json).to eq(
        {
          "data"=> {
            "type"=> "users",
            "id"=> user.id,
            "attributes"=> {
              "email"=> "buttercup@example.com",
              "username"=> "princess.buttercup",
            }
          }
        }
      )
      expect(signed_in?).to eq(true)
    end

    it "does not allow a user to sign up without an email" do
      sign_up_params = {
        email: "",
        password: "password",
        password_confirmation: "password",
        username: "princess.buttercup",
      }.to_json

      expect do
        post(url, params: sign_up_params, headers: good_request_headers)
      end.not_to change(User, :count)
      expect(response.code).to eq("422")
      expect(signed_in?).to eq(false)
      expect(json).to eq(
        {
          "status"=>"error",
          "data"=>
          {
            "id"=>nil,
            "provider"=>"email",
            "uid"=>"",
            "username"=>"princess.buttercup",
            "email"=>"",
            "created_at"=>nil,
            "updated_at"=>nil,
            "type"=>"user"
          },
          "errors"=>{
            "email"=>[
              "can't be blank",
              "is not an email"
            ],
            "full_messages"=>[
              "Email can't be blank",
              "Email is not an email"
            ]
          }
        }
      )
    end

    it "does not allow a user to sign up with invalid password confirmation" do
      sign_up_params = {
        email: "buttercup@example.com",
        password: "password",
        password_confirmation: "not the right password",
        username: "princess.buttercup",
      }.to_json

      expect do
        post(url, params: sign_up_params, headers: good_request_headers)
      end.not_to change(User, :count)
      expect(response.code).to eq("422")
      expect(signed_in?).to eq(false)
      expect(json).to eq(
        {
          "status"=>"error",
          "data"=>
          {
            "id"=>nil,
            "provider"=>"email",
            "uid"=>"",
            "username"=>"princess.buttercup",
            "email"=>"buttercup@example.com",
            "created_at"=>nil,
            "updated_at"=>nil,
            "type"=>"user"
          },
          "errors"=>{
            "password_confirmation"=>[
              "doesn't match Password"
            ],
            "full_messages"=>[
              "Password confirmation doesn't match Password"
            ]
          }
        }
      )
    end
  end
end
