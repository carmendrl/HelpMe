require "rails_helper"

RSpec.describe "LabSessions", type: :request do

  describe "POST /sessions" do
    let!(:url) { "https://example.com/lab_sessions" }
    let(:good_request_headers) { { "Content-Type" => "application/json" } }
    let(:user) { create(:professor) }

    before do
      good_request_headers.merge! sign_in(user)
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
            },
            "relationships" => {
              "questions" => {
                "data" => [],
              },
            },
          },
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
            },
            "relationships" => {
              "questions" => {
                "data" => [],
              },
            },
          },
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
            },
            "relationships" => {
              "questions" => {
                "data" => [],
              },
            },
          },
        }
      )
    end

    it "returns an error with a token that was taken" do
      create(:lab_session, token: "12")
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
              "message" => "has already been taken",
            }
          ]
        }
      )
    end

    it "does not allow a user to create a session if they are not signed in" do
      good_request_headers = {
        "Content-Type" => "application/json",
      }
      good_params = {
        "description" => "Computer science lab about C",
      }.to_json

      expect { post(url, params: good_params, headers: good_request_headers) }.not_to change(LabSession, :count)
      expect(response.code).to eq("401")
      expect(json).to eq(
        {
          "errors" => [
            "You need to sign in or sign up before continuing."
          ],
        }
      )
    end

    describe "POST /lab_sessions/join/:id" do
      let!(:url) { "https://example.com/lab_sessions/join" }
      let(:good_request_headers) { { "Content-Type" => "application/json" } }
      let(:good_request_json) { {"description" => "Computer science lab about C",
        "token" => "12345",
      }.to_json }
      let(:user) { create(:user) }
      let(:session) { post(url, params: good_request_json, headers: good_request_headers) }

      before do
        auth_headers = sign_in(user)
        good_request_headers.merge! auth_headers
      end

      it "lets a user join a session from a valid token" do
        valid_request_json = {
          "token" => "12345",
        }.to_json

        expect { post(url, params: valid_request_json) }.to change(user.lab_sessions, :count).by(1)

        expect(json).to eq(
          "status" => 202,
        )
      end

      it "does not let a user join a session from an invalid token" do
        invalid_request_json = {
          "token" => "00000",
        }.to_json

        expect { post(url, params: invalid_request_json) }.to_not change(user.lab_sessions, :count).by(1)

        expect(json).to eq(
          "status" => 401,
          "error" => {
            "type" => "unauthorized_request",
            "errors" => [
              {
                "attribute" => "token",
                "message" => "is invalid",
              }
            ]
          }
        )
      end
    end
  end
end
