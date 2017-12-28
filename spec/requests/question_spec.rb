require "rails_helper"

RSpec.describe "Questions", type: :request do
  let!(:lab_session) { create(:lab_session) }
  let!(:good_request_headers) { { "Content-Type" => "application/json" } }

  # Freeze the time
  before do
    new_time = Time.utc(2008, 9, 1, 12, 0, 0)
    Timecop.freeze(new_time)
  end

  after do
    Timecop.return
  end

  it "returns an error if the user is not signed in" do
    url = "https://example.com/lab_sessions/#{lab_session.id}/questions"
    get(url, headers: good_request_headers)
    expect(response.code).to eq("401")
    expect(json).to eq(
      {
        "errors" => [
          "You need to sign in or sign up before continuing."
        ],
      }
    )
  end

  context "as a student" do
    let!(:student) { create(:student) }
    before do
      good_request_headers.merge! sign_in(student)
      student.lab_sessions << lab_session
    end

    describe "GET /lab_sessions/:lab_session_id/questions/" do
      let(:url) { "https://example.com/lab_sessions/#{lab_session.id}/questions" }

      it "returns a list of a lab session's questions" do
        question_ids = []
        5.times do
          question = create(:question, lab_session: lab_session)
          question_ids << question.id
        end

        get(url, headers: good_request_headers)

        questions_json = json["data"]

        # Expect them to have the same items
        expect(question_ids.count).to eq(questions_json.count)
        questions_json.each do |question|
          id = question["id"]
          expect(question_ids).to include(id)
        end
      end

      it "renders the correct fields for the questions" do
        question = create(:question, lab_session: lab_session)
        get(url, headers: good_request_headers)

        expect(json).to eq({
          "data" => [
            {
              "id" => question.id,
              "type" => "questions",
              "attributes" => {
                "text" => question.text,
                "created-at" => question.created_at.iso8601,
                "status" => "claimed",
              },
              "relationships" => {
                "claimed-by" => {
                  "data" => {
                    "id" => question.claimed_by.id,
                    "type" => "professors",
                  },
                },
              },
            },
          ],
        })
      end
    end

    describe "POST /lab_sessions/:lab_session_id/questions" do
      it "creates a new question" do
        url = "https://example.com/lab_sessions/#{lab_session.id}/questions"

        create_params = {
          text: "How much wood can a woodchuck chuck?",
        }.to_json

        expect do
          post(url, params: create_params, headers: good_request_headers)
        end.to change(lab_session.questions, :count).from(0).to(1)
          .and change(student.questions_asked, :count).from(0).to(1)

        q = Question.last
        expect(q.original_asker).to eq(student)

        expect(json).to eq({
          "data" => {
            "type" => "questions",
            "id" => q.id,
            "attributes" => {
              "text" => "How much wood can a woodchuck chuck?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "pending",
            },
          },
        })
      end
    end

    describe "GET /lab_sessions/:lab_session_id/questions/:id" do
      it "returns the question" do
        question = create(:question, :unclaimed, text: "How do I test questions?")
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        get(url, headers: good_request_headers)

        expect(response.code).to eq("200")
        expect(json).to eq({
          "data" => {
            "id" => question.id,
            "type" => "questions",
            "attributes" => {
              "text" => "How do I test questions?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "pending",
            },
          },
        })
      end

      it "returns a 404 error if given a bad id" do
        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/12345"

        get(url, headers: good_request_headers)
        expect(response.code).to eq("404")
        expect(json).to eq({
          "error" => {
            "type" => "resource_not_found",
            "message" => "Couldn't find Question with 'id'=12345",
          },
        })
      end
    end

    describe "PUT /lab_sessions/:lab_session_id/questions/:id" do
      it "updates the question" do
        question = create(:question, text: "How do I test questions?")
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        update_params = {
          text: "I think I understand how to test questions?"
        }.to_json

        put(url, params: update_params, headers: good_request_headers)

        expect(response.code).to eq("200")

        expect(json).to eq({
          "data" => {
            "type" => "questions",
            "id" => question.id,
            "attributes" => {
              "text" => "I think I understand how to test questions?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "claimed",
            },
            "relationships" => {
              "claimed-by" => {
                "data" => {
                  "id" => question.claimed_by.id,
                  "type" => "professors",
                },
              },
            },
          },
        })
      end
    end

    describe "DELETE /lab_sessions/:lab_session_id/questions/:id" do
      it "deletes the question" do
        question = create(:question, text: "How do I test questions?")
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        expect do
          delete(url, headers: good_request_headers)
        end.to change(Question, :count).by(-1)

        expect(response.code).to eq("204")
      end
    end
  end

  context "as a professor" do
    let!(:professor) { create(:professor) }
    before do
      good_request_headers.merge! sign_in(professor)
      professor.lab_sessions << lab_session
    end

    describe "GET lab_sessions/:lab_session_id/questions" do
      let(:url) { "https://example.com/lab_sessions/#{lab_session.id}/questions" }

      it "returns a list of lab questions with aksers" do
        question_ids = []
        5.times do
          question = create(:question, lab_session: lab_session)
          question_ids << question.id
        end

        get(url, headers: good_request_headers)

        questions_json = json["data"]

        # Expect them to have the same items
        expect(question_ids.count).to eq(questions_json.count)
        questions_json.each do |question|
          id = question["id"]
          expect(question_ids).to include(id)
        end
      end

      it "renders the correct fields for the questions" do
        question = create(:question, lab_session: lab_session, original_asker: create(:student))
        get(url, headers: good_request_headers)

        expect(json).to eq({
          "data" => [
            {
              "id" => question.id,
              "type" => "questions",
              "attributes" => {
                "text" => question.text,
                "created-at" => "2008-09-01T12:00:00Z",
                "status" => "claimed",
              },
              "relationships" => {
                "original-asker" => {
                  "data" => {
                    "type" => "students",
                    "id" => question.original_asker.id,
                  },
                },
                "asked-by" => {
                  "data" => [
                    {
                      "type" => "students",
                      "id" => question.original_asker.id,
                    }
                  ],
                },
                "claimed-by" => {
                  "data" => {
                    "id" => question.claimed_by.id,
                    "type" => "professors",
                  },
                },
              },
            },
          ],
        })
      end
    end

    describe "POST /lab_sessions/:lab_session_id/questions" do
      it "creates a new question" do
        url = "https://example.com/lab_sessions/#{lab_session.id}/questions"

        create_params = {
          text: "How much wood can a woodchuck chuck?",
        }.to_json

        expect do
          post(url, params: create_params, headers: good_request_headers)
        end.to change(lab_session.questions, :count).from(0).to(1)
          .and change(professor.questions_asked, :count).from(0).to(1)

        q = Question.last
        expect(q.original_asker).to eq(professor)

        expect(json).to eq({
          "data" => {
            "type" => "questions",
            "id" => q.id,
            "attributes" => {
              "text" => "How much wood can a woodchuck chuck?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "pending",
            },
            "relationships" => {
              "original-asker" => {
                "data" => {
                  "type" => "professors",
                  "id" => professor.id
                },
              },
              "asked-by" => {
                "data" => [
                  {
                    "type" => "professors",
                    "id" => q.original_asker.id,
                  }
                ],
              },
            },
          },
        })
      end
    end

    describe "GET /lab_sessions/:lab_session_id/questions/:id" do
      it "gets the question" do
        question = create(:question, :unclaimed, text: "How do I test questions?")
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        get(url, headers: good_request_headers)

        expect(response.code).to eq("200")
        expect(json).to eq({
          "data" => {
            "id" => question.id,
            "type" => "questions",
            "attributes" => {
              "text" => "How do I test questions?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "pending",
            },
            "relationships" => {
              "original-asker" => {
                "data" => {
                  "type" => "students",
                  "id" => question.original_asker.id
                },
              },
              "asked-by" => {
                "data" => [
                  {
                    "type" => "students",
                    "id" => question.original_asker.id,
                  }
                ],
              },
            },
          },
        })
      end
    end

    describe "PUT /lab_sessions/:lab_session_id/questions/:id" do
      it "updates the question" do
        question = create(:question, text: "How do I test questions?")
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        update_params = {
          text: "I think I understand how to test questions?"
        }.to_json

        put(url, params: update_params, headers: good_request_headers)

        expect(response.code).to eq("200")

        expect(json).to eq({
          "data" => {
            "type" => "questions",
            "id" => question.id,
            "attributes" => {
              "text" => "I think I understand how to test questions?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "claimed",
            },
            "relationships" => {
              "original-asker" => {
                "data" => {
                  "type" => "students",
                  "id" => question.original_asker.id
                },
              },
              "asked-by" => {
                "data" => [
                  {
                    "type" => "students",
                    "id" => question.original_asker.id,
                  }
                ],
              },
              "claimed-by" => {
                "data" => {
                  "id" => question.claimed_by.id,
                  "type" => "professors",
                },
              },
            },
          },
        })
      end

      it "allows updating who has claimed the question" do
        question = create(:question, text: "How do I test questions?", claimed_by: create(:professor))
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        update_params = {
          claimed_by_id: professor.id,
          text: "I think I understand how to test questions?",
        }.to_json

        put(url, params: update_params, headers: good_request_headers)

        expect(response.code).to eq("200")

        expect(json).to eq({
          "data" => {
            "type" => "questions",
            "id" => question.id,
            "attributes" => {
              "text" => "I think I understand how to test questions?",
              "created-at" => "2008-09-01T12:00:00Z",
              "status" => "claimed",
            },
            "relationships" => {
              "original-asker" => {
                "data" => {
                  "type" => "students",
                  "id" => question.original_asker.id,
                },
              },
              "asked-by" => {
                "data" => [
                  {
                    "type" => "students",
                    "id" => question.original_asker.id,
                  }
                ],
              },
              "claimed-by" => {
                "data" => {
                  "id" => professor.id,
                  "type" => "professors",
                },
              },
            },
          },
        })
      end
    end

    describe "DELETE /lab_sessions/:lab_session_id/questions/:id" do
      it "deletes the question" do
        question = create(:question, text: "How do I test questions?")
        lab_session.questions << question

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

        expect do
          delete(url, headers: good_request_headers)
        end.to change(Question, :count).by(-1)

        expect(response.code).to eq("204")
      end
    end
  end

  it "is able to claim a question" do
    user = create(:professor)
    good_request_headers.merge! sign_in(user)

    lab_session.users << user

    question = create(:question, :unclaimed)
    lab_session.questions << question

    url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/claim"

    expect do
      get(url, headers: good_request_headers)
    end.to change(user.questions_claimed, :count).from(0).to(1)

    question.reload
    expect(question.reload).to be_claimed
    expect(question.claimed_by).to eq(user)
    expect(question.status).to eq("claimed")

    expect(json).to eq({
      "data" => {
        "id" => question.id,
        "type" => "questions",
        "attributes" => {
          "text" => question.text,
          "created-at" => "2008-09-01T12:00:00Z",
          "status" => "claimed",
        },
        "relationships" => {
          "original-asker" => {
            "data" => {
              "type" => "students",
              "id" => question.original_asker.id
            },
          },
          "asked-by" => {
            "data" => [
              {
                "type" => "students",
                "id" => question.original_asker.id,
              }
            ],
          },
          "claimed-by" => {
            "data" => {
              "id" => question.claimed_by.id,
              "type" => "professors",
            },
          },
        },
      }
    })
  end

  it "does not claim the qusetion if the user is not a part of the session" do
    user = create(:professor)
    good_request_headers.merge! sign_in(user)

    question = create(:question, :unclaimed)
    lab_session.questions << question

    url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/claim"
    expect do
      get(url, headers: good_request_headers)
    end.not_to change(user.questions_claimed, :count)

    expect(question.reload).not_to be_claimed
    expect(response.code).to eq("404")
  end

  it "allows multiple students to have the same question" do
    user = create(:student)
    lab_session.users << user

    good_request_headers.merge! sign_in(user)

    original_asker = create(:student)
    lab_session.users << original_asker

    question = create(:question, :unclaimed, original_asker: original_asker)
    lab_session.questions << question

    url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/askers"

    expect do
      post(url, headers: good_request_headers)
    end.to change(question.reload.askers, :count).from(1).to(2)
      .and change(user.reload.questions_asked, :count).by(1)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => {
        "id" => question.id,
        "type" => "questions",
        "attributes" => {
          "text" => question.text,
          "created-at" => "2008-09-01T12:00:00Z",
          "status" => "pending",
        },
      },
    })

    expect(question.askers).to contain_exactly(original_asker, user)
  end

  it "allows a student to remove themselves after having asked a question" do
    user = create(:student)
    lab_session.users << user

    good_request_headers.merge! sign_in(user)

    original_asker = create(:student)
    lab_session.users << original_asker

    question = create(:question, :unclaimed, original_asker: original_asker)
    lab_session.questions << question

    # This user must have also asked the question
    question.askers << user

    url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/askers"
    expect do
      delete(url, headers: good_request_headers)
    end.to change(user.reload.questions_asked, :count).by(-1)
      .and change(question.reload.askers, :count).by(-1)

    expect(response.code).to eq("204")
  end

  it "does not allow a question to be deleted if there are multiple users who are still asking it" do
    user = create(:student)
    lab_session.users << user
    good_request_headers.merge! sign_in(user)

    question = create(:question, lab_session: lab_session)
    question.askers << user

    url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}"

    expect do
      delete(url, headers: good_request_headers)
    end.not_to change(Question, :count)

    expect(response.code).to eq("405")
    expect(json).to eq({
      "error" => {
        "type" => "cannot_perform_operation",
        "message" => "This user must be the only one that has asked this question",
      },
    })
  end

  it "can get the tags of a question properly" do
    user = create(:student)
    lab_session.users << user
    good_request_headers.merge! sign_in(user)

    question = create(:question, tags: [create(:tag, name: "Safety"), create(:tag, name: "Hazard")])
    question.askers << user
    lab_session.questions << question

    url = "https://exmaple.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/tags"

    get(url, headers: good_request_headers)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => [
        "Safety",
        "Hazard",
      ],
    })
  end

  describe "tags" do
    let(:user) { create(:student) }
    before do
      lab_session.users << user
      good_request_headers.merge! sign_in(user)
    end

    it "can add a tag to a question" do
      question = create(:question, tags: [create(:tag, name: "Safety"), create(:tag, name: "Hazard")])
      question.askers << user
      lab_session.questions << question

      new_tag = create(:tag, :global, name: "Help!")

      params = {
        tag: "Help!",
      }.to_json

      url = "https://exmaple.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/tags/"

      post(url, headers: good_request_headers, params: params)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => [
          "Safety",
          "Hazard",
          "Help!",
        ],
      })

      expect(question.reload.tags).to include(new_tag)
    end

    it "can add a tag that is not global but is on the course" do
      question = create(:question, tags: [create(:tag, name: "Safety"), create(:tag, name: "Hazard")])
      question.askers << user
      lab_session.questions << question

      new_tag = create(:tag, global: false, name: "Help!")
      lab_session.course.tags << new_tag

      params = {
        tag: "Help!",
      }.to_json

      url = "https://exmaple.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/tags/"

      post(url, headers: good_request_headers, params: params)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => [
          "Safety",
          "Hazard",
          "Help!",
        ],
      })

      expect(question.reload.tags).to include(new_tag)
    end

    it "canoot add a tag that is not global and not on the course" do
      question = create(:question, tags: [create(:tag, name: "Safety"), create(:tag, name: "Hazard")])
      question.askers << user
      lab_session.questions << question

      new_tag = create(:tag, global: false, name: "Help!")

      params = {
        tag: "Help!",
      }.to_json

      url = "https://exmaple.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/tags/"

      post(url, headers: good_request_headers, params: params)

      expect(response.code).to eq("404")
      expect(json).to eq({
        "error" => {
          "type" => "resource_not_found",
          "message" => "Couldn't find record",
        },
      })
    end

    it "can remove tags" do
      tag = create(:tag, name: "Safety")
      question = create(:question, tags: [tag, create(:tag, name: "Hazard")])
      question.askers << user
      lab_session.questions << question

      url = "https://exmaple.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/tags/Safety/"

      delete(url, headers: good_request_headers)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => [
          "Hazard",
        ],
      })

      expect(question.reload.tags).not_to include(tag)
    end
  end
end
