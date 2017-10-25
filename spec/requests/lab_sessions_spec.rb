require "rails_helper"

RSpec.describe "LabSessions", type: :request do

  describe "POST /sessions" do
    let!(:url) { "https://example.com/lab_sessions" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }
    let(:user) { create(:user) }

    before do
      auth_headers = sign_in(user)
      good_request_headers.merge! auth_headers
    end

    it "creates a new session" do
      good_request_json = {
        "description" => "Computer science lab about C",
        "token" => "12345",
      }.to_json

      expect { post(url, params: good_request_json, headers: good_request_headers) }.to change(LabSession, :count).by(1)

      s = LabSession.last

      expect(json).to eq(
        {
          "data" => {
            "type" => "lab-sessions",
            "id" => s.id,
            "attributes" => {
              "description" => "Computer science lab about C",
              "token" => "12345",
              "active" => true,
            }
          }
        }
      )
    end

    it "creates a new session without a token" do
      good_request_json = {
        "description" => "Computer science lab about C",
      }.to_json

      expect { post(url, params: good_request_json, headers: good_request_headers) }.to change(LabSession, :count).from(0).to(1)

      # Get the session we just created so we can verify that the token returned
      # is the one we expect
      s = LabSession.last

      expect(json).to eq(
        {
          "data" => {
            "type" => "lab-sessions",
            "id" => s.id,
            "attributes" => {
              "description" => "Computer science lab about C",
              "token" => s.token,
              "active" => true,
            }
          }
        }
      )
    end

    it "creates a new session without a token or description" do
      expect { post(url, params: {}, headers: good_request_headers) }.to change(LabSession, :count).from(0).to(1)

      # Get the session we just created so we can verify that the token returned
      # is the one we expect
      s = LabSession.last

      expect(json).to eq(
        {
          "data" => {
            "type" => "lab-sessions",
            "id" => s.id,
            "attributes" => {
              "description" => "",
              "token" => s.token,
              "active" => true,
            }
          }
        }
      )
    end

    it "returns an error with a token too small" do
      invalid_params = {
        "token" => 12,
      }.to_json

      expect { post(url, params: invalid_params, headers: good_request_headers) }.not_to change(LabSession, :count)
      expect(json).to eq(
        "status" => 422,
        "error" => {
          "type" => "resource_invalid",
          "errors" => [
            {
              "attribute" => "token",
              "message" => "is the wrong length (should be 5 characters)",
            }
          ]
        }
      )
    end

    it "returns an error with a token too large" do
      invalid_params = {
        "token" => 123456,
      }.to_json

      expect { post(url, params: invalid_params, headers: good_request_headers) }.not_to change(LabSession, :count)
      expect(json).to eq(
        "status" => 422,
        "error" => {
          "type" => "resource_invalid",
          "errors" => [
            {
              "attribute" => "token",
              "message" => "is the wrong length (should be 5 characters)",
            }
          ]
        }
      )
    end
  end
end
