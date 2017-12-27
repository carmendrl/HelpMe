require "rails_helper"

RSpec.describe "Answer", type: :request do
  let(:lab_session) { create(:lab_session) }
  let(:question) { create(:question, lab_session: lab_session) }
  let(:good_request_headers) { { "Content-Type" => "application/json" } }

  # Freeze the time
  before do
    new_time = Time.utc(2008, 9, 1, 12, 0, 0)
    Timecop.freeze(new_time)
  end

  after do
    Timecop.return
  end

  it "returns an error if the user is not signed in" do
    url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/answer"
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

  context "with a signed in user" do
    let(:professor) { create(:professor) }

    before do
      good_request_headers.merge! sign_in(professor)
      professor.lab_sessions << lab_session
      lab_session.questions << question
    end

    describe "GET /lab_sessions/:lab_session_id/questions/:question_id/answer" do
      let(:url) { "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/answer" }

      it "renders the correct fields for the answer" do
        answer = create(:answer, question: question, answerer: professor)
        get(url, headers: good_request_headers)

        expect(json).to eq({
          "data" => {
            "id" => answer.id,
            "type" => "answers",
            "attributes" => {
              "text" => answer.text,
              "created-at" => answer.created_at.iso8601,
            },
            "relationships" => {
              "answerer" => {
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

    describe "POST /lab_sessions/:lab_session_id/question/:question_id/answer" do
      it "creates an answer" do
        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/answer"
        create_params = {
          text: "This is the answer"
        }.to_json

        post(url, params: create_params, headers: good_request_headers)
        answer = Answer.last

        expect(Answer.count).to eq(1)

        question.reload
        expect(question.answer).to eq(answer)
        expect(question.status).to eq("answered")

        expect(json).to eq({
          "data" => {
            "id" => answer.id,
            "type" => "answers",
            "attributes" => {
              "text" => "This is the answer",
              "created-at" => answer.created_at.iso8601,
            },
            "relationships" => {
              "answerer" => {
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

    describe "PUT /lab_sessions/:lab_session_id/questions/:question_id/answer" do
      it "updates an answer" do
        answer = create(:answer, text: "This is an answer", answerer: professor, question: question)

        update_params = {
          text: "This is the new, updated answer"
        }.to_json

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/answer"
         put(url, params: update_params, headers: good_request_headers)

         expect(status).to eq(200)

         expect(json).to eq({
          "data" => {
            "id" => answer.id,
            "type" => "answers",
            "attributes" => {
              "text" => "This is the new, updated answer",
              "created-at" => answer.created_at.iso8601,
            },
            "relationships" => {
              "answerer" => {
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

    describe "DELETE /lab_sessions/:lab_session_id/questions/:question_id/answer" do
      it "deletes an answer" do
        answer = create(:answer, text: "This is an answer", answerer: professor, question: question)

        url = "https://example.com/lab_sessions/#{lab_session.id}/questions/#{question.id}/answer"

        delete(url, headers: good_request_headers)

        expect(Answer.count).to eq(0)
        expect(status).to eq(204)

        question.reload
        expect(question.answer).to be_nil
        expect(question.status).to eq("claimed")
      end
    end
  end
end
