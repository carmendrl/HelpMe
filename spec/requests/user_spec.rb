require "rails_helper"

RSpec.describe "Users", type: :request do
  let(:headers) { { "Content-Type" => "application/json" } }

  it "allows retreiving user information" do
    professor = create(:professor)

    student = create(:student)
    url = "https://example.com/system/users/#{student.id}"

    headers.merge! sign_in(professor)

    get(url, headers: headers)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => {
        "id" => student.id,
        "type" => "students",
        "attributes" => {
          "username" => student.username,
          "email" => student.email,
          "role" => "none",
        },
      },
    })
  end

  it "can promote a user to ta" do
    professor = create(:professor)
    headers.merge! sign_in(professor)

    student = create(:student)
    url = "https://example.com/system/users/promote/"

    params = {
      user_id: student.id,
    }.to_json

    post(url, headers: headers, params: params)

    expect(student.reload).to be_ta
    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => {
        "id" => student.id,
        "type" => "students",
        "attributes" => {
          "email" => student.email,
          "username" => student.username,
          "role" => "ta",
        },
      },
    })
  end

  it "can demote a user from ta" do
    professor = create(:professor)
    headers.merge! sign_in(professor)

    student = create(:student, :ta)
    url = "https://example.com/system/users/demote/"

    params = {
      user_id: student.id,
    }.to_json

    post(url, headers: headers, params: params)

    expect(student.reload).not_to be_ta
    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => {
        "id" => student.id,
        "type" => "students",
        "attributes" => {
          "email" => student.email,
          "username" => student.username,
          "role" => "none",
        },
      },
    })
  end

  it "errors when promoting a user and the promoter is not a professor" do
    student = create(:student)
    headers.merge! sign_in(student)

    user = create(:student)
    url = "https://example.com/system/users/promote/"

    params = {
      user_id: user.id,
    }.to_json

    post(url, headers: headers, params: params)

    expect(user.reload).not_to be_ta
    expect(response.code).to eq("405")
    expect(json).to eq({
      "error" => {
        "type" => "cannot_perform_operation",
        "message" => "Must be a professor to promote a student."
      },
    })
  end


  it "errors when demoting a user and the demoter is not a professor" do
    student = create(:student)
    headers.merge! sign_in(student)

    user = create(:student, :ta)
    url = "https://example.com/system/users/demote/"

    params = {
      user_id: user.id,
    }.to_json

    post(url, headers: headers, params: params)

    expect(user.reload).to be_ta
    expect(response.code).to eq("405")
    expect(json).to eq({
      "error" => {
        "type" => "cannot_perform_operation",
        "message" => "Must be a professor to demote a student."
      },
    })
  end
end
