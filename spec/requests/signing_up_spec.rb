require "rails_helper"

RSpec.describe "Signing up", type: :request do
  describe "POST /users" do
    let!(:url) { "https://example.com/users" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }

    it "allows a student to sign up with good parameters" do
      sign_up_params = {
        email: "buttercup@example.com",
        password: "password",
        password_confirmation: "password",
        username: "princess.buttercup",
        type: "Student",
        first_name: "Princess",
        last_name: "Buttercup"
      }.to_json

      expect do
        post(url, params: sign_up_params, headers: good_request_headers)
      end.to change(Student, :count).from(0).to(1)
      expect(response.code).to eq("200")

      student = Student.last

      expect(json).to eq(
        {
          "data"=> {
            "id"=> student.id,
            "type"=> "students",
            "attributes"=> {
              "email"=> "buttercup@example.com",
              "username"=> "princess.buttercup",
              "role" => "none",
              "first-name" => "Princess",
              "last-name" => "Buttercup"
            }
          }
        }
      )
      expect(signed_in?).to eq(true)
    end

    it "allows a professor to sign up with good parameters" do
      sign_up_params = {
        email: "buttercup@example.com",
        password: "password",
        password_confirmation: "password",
        username: "princess.buttercup",
        type: "Professor",
        first_name: "Princess",
        last_name: "Buttercup"
      }.to_json

      expect do
        post(url, params: sign_up_params, headers: good_request_headers)
      end.to change(Professor, :count).from(0).to(1)
      expect(response.code).to eq("200")

      prof = Professor.last

      expect(json).to eq(
        {
          "data"=> {
            "id"=> prof.id,
            "type"=> "professors",
            "attributes"=> {
              "email"=> "buttercup@example.com",
              "username"=> "princess.buttercup",
              "role" => "none",
              "first-name" => "Princess",
              "last-name" => "Buttercup"
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
        first_name: "Princess",
        last_name: "Buttercup",
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
            "role" => "none",
            "first_name" => "Princess",
            "last_name" => "Buttercup",
            "type"=>"user",
          },
          "errors"=>{
            "email"=>[
              "can't be blank",
              "is not an email",
            ],
            "full_messages"=>[
              "Email can't be blank",
              "Email is not an email",
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
        first_name: "Princess",
        last_name: "Buttercup",
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
            "role" => "none",
            "first_name" => "Princess",
            "last_name" => "Buttercup",
            "type"=>"user",
          },
          "errors"=>{
            "password_confirmation"=>[
              "doesn't match Password",
            ],
            "full_messages"=>[
              "Password confirmation doesn't match Password"
            ]
          },
        }
      )
    
  end

  it "does not allow a user to sign up without a first name" do
    sign_up_params = {
      email: "buttercup@example.com",
      password: "password",
      password_confirmation: "password",
      username: "princess.buttercup",
      first_name: "",
      last_name: "Buttercup",
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
          "role" => "none",
          "first_name" =>"",
          "last_name" => "Buttercup",
          "type"=>"user",
        },
        "errors"=>{
          "first_name"=>[
            "can't be blank"
          ], 
          "full_messages"=>[
            "First name can't be blank"
            ]
          }
      }
    )
  
end

it "does not allow a user to sign up without a last name" do
  sign_up_params = {
    email: "buttercup@example.com",
    password: "password",
    password_confirmation: "password",
    username: "princess.buttercup",
    first_name: "Princess",
    last_name: "",
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
        "role" => "none",
        "first_name" => "Princess",
        "last_name"=> "",
        "type"=>"user",
      },
      "errors"=>{
        "last_name"=>[
          "can't be blank"
        ], 
        "full_messages"=>[
          "Last name can't be blank"
          ]
        }
    }
  )

end
end
end
