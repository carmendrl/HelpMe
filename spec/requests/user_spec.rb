require "rails_helper"

RSpec.describe "Users", type: :request do
  it "allows retreiving user information" do
    professor = create(:professor)

    student = create(:student)
    url = "https://example.com/system/users/#{student.id}"

    request_headers = {
      "Content-Type" => "application/json",
    }.merge! sign_in(professor)

    get(url, headers: request_headers)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => {
        "id" => student.id,
        "type" => "students",
        "attributes" => {
          "username" => student.username,
          "email" => student.email,
        },
      },
    })
  end
end
