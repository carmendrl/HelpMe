require "rails_helper"

RSpec.describe "LabSessions", type: :request do
  let(:good_request_headers) { { "Content-Type" => "application/json" } }

  describe "POST /lab_sessions" do
    let!(:url) { "https://example.com/lab_sessions" }
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
      expect(response.code).to eq("422")
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
      let(:user) { create(:student) }

      before do
        auth_headers = sign_in(user)
        good_request_headers.merge! auth_headers

        new_time = Time.utc(2017, 11, 13, 12, 2, 1)
        Timecop.freeze(new_time)
      end

      after do
        Timecop.return
      end

      it "lets a user join a session from a valid token" do

        expect do
          post(url, headers: good_request_headers)
        end.to change(user.lab_sessions, :count).from(0).to(1)
           .and change(lab_session.users, :count).from(0).to(1)

        membership = user.lab_session_memberships.last

        expect(json).to eq(
          {
            "data" => {
              "id" => membership.id,
              "type" => "lab-session-memberships",
              "attributes" => {
                "created-at" => "2017-11-13T12:02:01Z",
              },
              "relationships" => {
                "lab-session" => {
                  "data" => {
                    "id" => lab_session.id,
                    "type" => "lab-sessions",
                  },
                },
                "user" => {
                  "data" => {
                    "id" => user.id,
                    "type" => "students",
                  },
                },
              },
            },
          }
        )
      end

      it "does not allow a user to join a session they are already a part of" do
        user.lab_sessions << lab_session
        membership = user.lab_session_memberships.first

        expect do
          post(url, headers: good_request_headers)
        end.not_to change(user.lab_sessions, :count)

        # It will still render the same membership for continuity
        expect(json).to eq(
          {
            "data" => {
              "id" => membership.id,
              "type" => "lab-session-memberships",
              "attributes" => {
                "created-at" => "2017-11-13T12:02:01Z",
              },
              "relationships" => {
                "lab-session" => {
                  "data" => {
                    "id" => lab_session.id,
                    "type" => "lab-sessions",
                  },
                },
                "user" => {
                  "data" => {
                    "id" => user.id,
                    "type" => "students",
                  },
                },
              },
            },
          }
        )
        expect(response.code).to eq("200")
      end

      it "does not let a user join a session from an invalid token" do
        url = "https://example.com/lab_sessions/join/00000"
        expect do
          post(url, headers: good_request_headers)
        end.not_to change(user.lab_sessions, :count)

        expect(json).to eq(
          {
            "error"=> {
              "type"=>"resource_not_found",
              "message"=>"Couldn't find Lab session",
            },
          },
        )
        expect(response.code).to eq("404")
      end
    end
  end

  describe "DELETE /lab_sessions/:id/leave" do
    let(:lab_session) { create(:lab_session, users: [create(:student)]) }
    let!(:url) { "https://example.com/lab_sessions/#{lab_session.id}/leave" }
    let(:user) { create(:student, lab_sessions: [lab_session]) }

    before { good_request_headers.merge! sign_in(user) }

    it "allows a user to leave a lab session" do
      expect(lab_session.users.count).to eq(2)

      expect do
        delete(url, headers: good_request_headers)
      end.to change(user.lab_sessions, :count).by(-1)
        .and change(LabSession, :count).by(0)

      expect(response.code).to eq("204")
    end
  end

  describe "GET /lab_sessions/:id" do
    let(:lab_session) { create(:lab_session) }
    let!(:url) { "https://example.com/lab_sessions/#{lab_session.id}" }
    let(:user) { create(:student) }

    before { good_request_headers.merge! sign_in(user) }

    it "gets the lab session if the user is on the lab session" do
      lab_session.users << user

      get(url, headers: good_request_headers)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => {
          "id" => lab_session.id,
          "type" => "lab-sessions",
          "attributes" => {
            "description" => lab_session.description,
            "token" => lab_session.token,
            "active" => lab_session.active,
          },
          "relationships" => {
            "questions" => {
              "data" => [],
            },
          },
        },
      })
    end

    it "returns an error if the user is not a part of a lab session" do
      get(url, headers: good_request_headers)

      expect(response.code).to eq("404")
      expect(json).to eq({
        "error" => {
          "type" => "resource_not_found",
          "message" => "Couldn't find Lab session with 'id'=#{lab_session.id}",
        },
      })
    end
  end

  describe "DELETE /lab_sessions/:id" do
    let(:lab_session) { create(:lab_session) }
    let!(:url) { "https://example.com/lab_sessions/#{lab_session.id}" }

    it "deletes the lab session if the user is the only one on it" do
      user = create(:student)
      good_request_headers.merge! sign_in(user)
      lab_session.users = [user]

      expect do
        delete(url, headers: good_request_headers)
      end.to change(user.lab_sessions, :count).from(1).to(0)

      expect(response.code).to eq("204")
    end

    it "deletes the lab session if the user is a professor even if there are multiple users" do
      user = create(:professor)
      good_request_headers.merge! sign_in(user)
      lab_session.users << user
      lab_session.users << create(:student)

      expect do
        delete(url, headers: good_request_headers)
      end.to change(user.lab_sessions, :count).from(1).to(0)

      expect(response.code).to eq("204")
    end

    it "returns an error if the user is not on the lab session" do
      user = create(:student)
      good_request_headers.merge! sign_in(user)

      delete(url, headers: good_request_headers)

      expect(response.code).to eq("404")
      expect(json).to eq({
        "error" => {
          "type" => "resource_not_found",
          "message" => "Couldn't find Lab session with 'id'=#{lab_session.id}",
        },
      })
    end

    it "returns an error if a student tries to delete with more than one user" do
      user = create(:student)
      good_request_headers.merge! sign_in(user)

      lab_session.users << user
      lab_session.users << create(:student)

      delete(url, headers: good_request_headers)
      expect(json).to eq({
        "error" => {
          "type" => "cannot_perform_operation",
          "message" => "This user must be the only user on the lab session",
        },
      })
    end
  end

  describe "GET /lab_sessions" do
    let!(:url) { "https://example.com/lab_sessions" }
    let(:user) { create(:student) }

    before { good_request_headers.merge! sign_in(user) }

    it "gets a users lab sessions" do
      lab_session_ids = []
      5.times do
        lab_session = create(:lab_session, users: [user])
        lab_session_ids << lab_session.id
      end

      get(url, headers: good_request_headers)

      lab_session_json  = json["data"]

      # Expect them to have the same items
      expect(lab_session_ids.count).to eq(lab_session_json.count)
      lab_session_json.each do |lab|
        id = lab["id"]
        expect(lab_session_ids).to include(id)
      end
    end

    it "gets the lab session data correctly" do
      lab_session = create(:lab_session, users: [user])

      get(url, headers: good_request_headers)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => [
          {
            "id" => lab_session.id,
            "type" => "lab-sessions",
            "attributes" => {
              "description" => lab_session.description,
              "token" => lab_session.token,
              "active" => lab_session.active,
            },
            "relationships" => {
              "questions" => {
                "data" => [],
              },
            },
          },
        ],
      })
    end
  end

  describe "PUT /lab_sessions/:id" do
    let(:lab_session) { create(:lab_session) }
    let!(:url) { "https://example.com/lab_sessions/#{lab_session.id}" }
    let(:user) { create(:student) }

    before { good_request_headers.merge! sign_in(user) }

    it "allows a user to update the lab session" do
      lab_session.users << user

      params = {
        description: "This is a brand new description!",
      }.to_json

      put(url, headers: good_request_headers, params: params)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => {
          "id" => lab_session.id,
          "type" => "lab-sessions",
          "attributes" => {
            "description" => "This is a brand new description!",
            "token" => lab_session.token,
            "active" => lab_session.active,
          },
          "relationships" => {
            "questions" => {
              "data" => [],
            },
          },
        },
      })
    end
  end
end
