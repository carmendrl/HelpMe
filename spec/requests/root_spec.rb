require "rails_helper"

RSpec.describe "Root API", type: :request do

  describe "GET /" do
    before { get "/" }

    it "returns a basic response" do
      expect(json).not_to be_empty
      expect(response).to have_http_status(200)
    end
  end
end
