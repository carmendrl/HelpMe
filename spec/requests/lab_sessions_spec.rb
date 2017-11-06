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

      expect { post(url, params: invalid_params, headers: good_request_headers) }.to_not change(LabSession, :count)
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

    describe "POST /lab_sessions/join/:token" do
      let(:lab_session) { create(:lab_session) }
      let!(:url) { "https://example.com/lab_sessions/join/#{lab_session.token}" }
      let(:good_request_headers) { { "Content-Type" => "application/json" } }
      let(:good_request_json) { {"description" => "Computer science lab about C",
        "token" => "12345",
      }.to_json }
      let(:user) { create(:user) }

      before do
        auth_headers = sign_in(user)
        good_request_headers.merge! auth_headers
      end

      it "lets a user join a session from a valid token" do
        valid_request_json = {
          token: lab_session.token,
        }.to_json

        expect do
          post(url, params: valid_request_json, headers: good_request_headers)
        end.to change(user.lab_sessions, :count).from(0).to(1)
           .and change(lab_session.users, :count).from(0).to(1)

        expect(json).to eq(
          {
            "data" => {
              "id" => json["data"]["id"],
              "type" => "lab-session-memberships",
              "attributes" => {
                "created_at" => lab_session.created_at,
              },
              "relationships" => {
                "lab_session" => {
                  "data" => {
                    "id" => lab_session.id,
                    "type" => "lab-sessions"
                  }     
                },
                "user" => {
                  "data" => {
                    "id" => user.id,
                    "type" => "users"
                  }
                }
              }
            }
          }
        )
      end

      it "does not let a user join a session from an invalid token" do
        url = "https://example.com/lab_sessions/join/00000"
        expect do
          post(url, headers: good_request_headers)
        end.not_to change(user.lab_sessions, :count)

        expect(json).to eq(
          "status" => 404,
          "error" => {
            "type" => "resource_not_found",
            "errors" => [],
          }
        )
      end
    end
  end
end
