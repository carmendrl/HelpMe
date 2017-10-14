require "rails_helper"

RSpec.describe "Sessions", type: :request do

  describe "POST /sessions" do
    let!(:url) { "https://example.com/sessions" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }

    it "creates a new session" do
      good_request_json = {
        "description" => "Computer science lab about C",
        "number" => "12345",
      }.to_json

      expect { post(url, params: good_request_json, headers: good_request_headers) }.to change(Session, :count).by(1)

      s = Session.last

      expect(json).to eq(
        {
          "data" => {
            "type" => "sessions",
            "id" => s.id,
            "attributes" => {
              "description" => "Computer science lab about C",
              "number" => 12345,
              "active" => true,
            }
          }
        }
      )
    end

    it "creates a new session without a number" do
      good_request_json = {
        "description" => "Computer science lab about C",
      }.to_json

      expect { post(url, params: good_request_json, headers: good_request_headers) }.to change(Session, :count).from(0).to(1)

      # Get the session we just created so we can verify that the number returned
      # is the one we expect
      s = Session.last

      expect(json).to eq(
        {
          "data" => {
            "type" => "sessions",
            "id" => s.id,
            "attributes" => {
              "description" => "Computer science lab about C",
              "number" => s.number,
              "active" => true,
            }
          }
        }
      )
    end

    it "creates a new session without a number or description" do
      expect { post(url, params: {}, headers: good_request_headers) }.to change(Session, :count).from(0).to(1)

      # Get the session we just created so we can verify that the number returned
      # is the one we expect
      s = Session.last

      expect(json).to eq(
        {
          "data" => {
            "type" => "sessions",
            "id" => s.id,
            "attributes" => {
              "description" => nil,
              "number" => s.number,
              "active" => true,
            }
          }
        }
      )
    end

    it "returns an error with a number too small" do
      invalid_params = {
        "number" => 12,
      }.to_json

      expect { post(url, params: invalid_params, headers: good_request_headers) }.not_to change(Session, :count)
      expect(json).to eq(
        "status" => 422,
        "error" => {
          "type" => "resource_invalid",
          "errors" => [
            {
              "attribute" => "number",
              "message" => "is the wrong length (should be 5 characters)",
            }
          ]
        }
      )
    end

    it "returns an error with a number too large" do
      invalid_params = {
        "number" => 123456,
      }.to_json

      expect { post(url, params: invalid_params, headers: good_request_headers) }.not_to change(Session, :count)
      expect(json).to eq(
        "status" => 422,
        "error" => {
          "type" => "resource_invalid",
          "errors" => [
            {
              "attribute" => "number",
              "message" => "is the wrong length (should be 5 characters)",
            }
          ]
        }
      )
    end
  end
end
