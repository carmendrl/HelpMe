require "rails_helper"

RSpec.describe "Tags", type: :request do

  it "returns all global tags properly" do
    tag2 = create(:tag, :global)
    tag1 = create(:tag, :global)

    user = create(:student)
    headers = { "Content-Type" => "application/json" }
    headers.merge! sign_in(user)

    url = "https://example.com/tags"

    get(url, headers: headers)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => [
        tag1.name,
        tag2.name,
      ],
    })
  end
end
