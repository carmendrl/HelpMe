require "rails_helper"

RSpec.describe "Courses", type: :request do
  let!(:headers) { { "Content-Type" => "application/json" } }

  describe "GET /courses" do
    it "returns all of the courses" do
      user = create(:professor)
      headers.merge! sign_in(user)

      course1 = create(:course)
      course2 = create(:course)

      url = "https://example.com/courses"
      get(url, headers: headers)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => [
          {
            "id" => course1.id,
            "type" => "courses",
            "attributes" => {
              "title" => course1.title,
              "subject" => course1.subject,
              "number" => course1.number,
              "semester" => course1.semester,
            },
            "relationships" => {
              "instructor" => {
                "data" => {
                  "id" => course1.instructor.id,
                  "type" => "professors",
                },
              },
            },
          },
          {
            "id" => course2.id,
            "type" => "courses",
            "attributes" => {
              "title" => course2.title,
              "subject" => course2.subject,
              "number" => course2.number,
              "semester" => course2.semester,
            },
            "relationships" => {
              "instructor" => {
                "data" => {
                  "id" => course2.instructor.id,
                  "type" => "professors",
                },
              },
            },
          },
        ],
      })
    end
  end

  describe "POST /courses" do
    let(:user) { create(:professor) }
    let(:url) { "https://example.com/courses" }

    before { headers.merge! sign_in(user) }

    it "creates a course with valid params" do
      params = {
        title: "Database Systems",
        subject: "CSCI",
        number: "392",
        semester: "201708",
      }.to_json

      expect do
        post(url, headers: headers, params: params)
      end.to change(Course, :count).by(1)

      course = Course.last

      expect(response.code).to eq("200")
      expect(json).to eq({
          "data" => {
            "id" => course.id,
            "type" => "courses",
            "attributes" => {
              "title" => "Database Systems",
              "subject" => "CSCI",
              "number" => "392",
              "semester" => "201708",
            },
            "relationships" => {
              "instructor" => {
                "data" => {
                  "id" => user.id,
                  "type" => "professors",
                },
              },
            },
          },
      })
    end

    it "returns an error with invalid values for semester" do
      params = {
        title: "Database Systems",
        subject: "CSCI",
        number: "392",
        semester: "2017089",
      }.to_json

      expect do
        post(url, headers: headers, params: params)
      end.not_to change(Course, :count)

      expect(response.code).to eq("422")
      expect(json).to eq({
        "error" => {
          "type" => "resource_invalid",
          "errors" => [
            {
              "attribute" => "semester",
              "message" => "is invalid",
            }
          ]
        }
      })
    end

    it "returns an error if a required value is missing" do
      params = {
        title: "Database Systems",
        subject: "CSCI",
        semester: "201708",
      }.to_json

      expect do
        post(url, headers: headers, params: params)
      end.not_to change(Course, :count)

      expect(response.code).to eq("422")
      expect(json).to eq({
        "error" => {
          "type" => "resource_invalid",
          "errors" => [
            {
              "attribute" => "number",
              "message" => "can't be blank",
            }
          ]
        }
      })
    end

    it "returns an error if a student is attempting to create a course" do
      params = {
        title: "Database Systems",
        subject: "CSCI",
        number: "392",
        semester: "201708",
      }.to_json

      student = create(:student)
      headers.merge! sign_in(student)

      expect do
        post(url, headers: headers, params: params)
      end.not_to change(Course, :count)

      expect(response.code).to eq("405")
      expect(json).to eq({
        "error" => {
          "type" => "cannot_perform_operation",
          "message" => "Must be a professor to create a course.",
        }
      })
    end
  end

  describe "GET /courses/:id" do
    let(:instructor) { create(:professor) }
    let(:course) { create(:course, title: "Database Systems", subject: "CSCI", number: "392", semester: "201708", instructor: instructor) }
    let(:url) { "https://example.com/courses/#{course.id}" }

    it "returns the course properly as a student" do
      student = create(:student)
      headers.merge! sign_in(student)

      get(url, headers: headers)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => {
          "id" => course.id,
          "type" => "courses",
          "attributes" => {
            "title" => "Database Systems",
            "subject" => "CSCI",
            "number" => "392",
            "semester" => "201708",
          },
          "relationships" => {
            "instructor" => {
              "data" => {
                "id" => instructor.id,
                "type" => "professors",
              },
            },
          },
        },
      })
    end

    it "returns the course properly as a professor" do
      professor = create(:student)
      headers.merge! sign_in(professor)

      get(url, headers: headers)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => {
          "id" => course.id,
          "type" => "courses",
          "attributes" => {
            "title" => "Database Systems",
            "subject" => "CSCI",
            "number" => "392",
            "semester" => "201708",
          },
          "relationships" => {
            "instructor" => {
              "data" => {
                "id" => instructor.id,
                "type" => "professors",
              },
            },
          },
        },
      })
    end
  end

  describe "PUT /courses/:id" do
    it "updates the course properly as a professor" do
      user = create(:professor)
      headers.merge! sign_in(user)

      course = create(:course, title: "Senior Project", subject: "CSCI", number: "481", semester: "201601")

      url = "https://example.com/courses/#{course.id}"

      params = {
        title: "Database Systems",
        subject: "CSCI",
        number: "392",
        semester: "201708",
      }.to_json

      put(url, headers: headers, params: params)

      expect(response.code).to eq("200")
      expect(json).to eq({
        "data" => {
          "id" => course.id,
          "type" => "courses",
          "attributes" => {
            "title" => "Database Systems",
            "subject" => "CSCI",
            "number" => "392",
            "semester" => "201708",
          },
          "relationships" => {
            "instructor" => {
              "data" => {
                "id" => course.instructor.id,
                "type" => "professors",
              },
            },
          },
        },
      })
    end

    it "returns an error if a student tries to update a course" do
      user = create(:student)
      headers.merge! sign_in(user)

      course = create(:course, title: "Senior Project", subject: "CSCI", number: "481", semester: "201601")

      url = "https://example.com/courses/#{course.id}"

      params = {
        title: "Database Systems",
        subject: "CSCI",
        number: "392",
        semester: "201708",
      }.to_json

      put(url, headers: headers, params: params)

      expect(response.code).to eq("405")
      expect(json).to eq({
        "error" => {
          "type" => "cannot_perform_operation",
          "message" => "Must be a professor to update a course.",
        },
      })
    end
  end

  describe "DELETE /courses/:id" do
    let(:course) { create(:course) }
    let!(:url) { "https://example.com/courses/#{course.id}" }

    it "deletes the course if the user is a professor" do
      user = create(:professor)
      headers.merge! sign_in(user)

      expect do
        delete(url, headers: headers)
      end.to change(Course, :count).by(-1)

      expect(response.code).to eq("204")
    end

    it "returns an error if a student attempts to delete a course" do
      user = create(:student)
      headers.merge! sign_in(user)

      expect do
        delete(url, headers: headers)
      end.not_to change(Course, :count)

      expect(response.code).to eq("405")
      expect(json).to eq({
        "error" => {
          "type" => "cannot_perform_operation",
          "message" => "Must be a professor to delete a course.",
        },
      })
    end
  end
end
