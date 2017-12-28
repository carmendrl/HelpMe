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

  describe "users on a course" do
    describe "POST /courses/:id/students/" do
      it "adds a user to a course" do
        user = create(:student)
        course = create(:course)

        headers.merge! sign_in(user)

        url = "https://example.com/courses/#{course.id}/students/"

        expect do
          post(url, headers: headers)
        end.to change(course.users, :count).from(0).to(1)
          .and change(user.courses, :count).from(0).to(1)

        expect(response.code).to eq("204")
      end
    end

    describe "DELETE /courses/:id/students/:id" do

      it "removes a student if they are the ones requesting to be removed" do
        user = create(:student)
        course = create(:course, users: [user])

        headers.merge! sign_in(user)

        url = "https://example.com/courses/#{course.id}/students/#{user.id}/"

        expect do
          delete(url, headers: headers)
        end.to change(course.users, :count).from(1).to(0)
          .and change(user.courses, :count).from(1).to(0)

        expect(response.code).to eq("204")
      end

      it "removes a student if a professor removes them" do
        user = create(:professor)
        student_to_remove = create(:student)
        course = create(:course, users: [student_to_remove])

        headers.merge! sign_in(user)

        url = "https://example.com/courses/#{course.id}/students/#{student_to_remove.id}/"

        expect do
          delete(url, headers: headers)
        end.to change(course.users, :count).from(1).to(0)

        expect(response.code).to eq("204")
      end

      it "returns an error if a student requests to remove another student" do
        user = create(:student)
        student_to_remove = create(:student)
        course = create(:course, users: [student_to_remove])

        headers.merge! sign_in(user)

        url = "https://example.com/courses/#{course.id}/students/#{student_to_remove.id}/"

        expect do
          delete(url, headers: headers)
        end.not_to change(course.users, :count)

        expect(response.code).to eq("405")
        expect(json).to eq({
          "error" => {
            "type" => "cannot_perform_operation",
            "message" => "Cannot remove this user from the course",
          },
        })
      end

      it "returns an error if the user that is being removed is not on the course" do
        user = create(:professor)
        student_to_remove = create(:student)
        course = create(:course)

        headers.merge! sign_in(user)

        url = "https://example.com/courses/#{course.id}/students/#{student_to_remove.id}/"
        expect do
          delete(url, headers: headers)
        end.not_to change(course.users, :count)

        expect(response.code).to eq("405")
        expect(json).to eq({
          "error" => {
            "type" => "cannot_perform_operation",
            "message" => "User is not on that course",
          },
        })
      end
    end
  end

  it "gets the tags on the course" do
    course = create(:course, tags: [create(:tag, name: "CS"), create(:tag, name: "Coding")])

    user = create(:student)
    course.users << user
    headers.merge! sign_in(user)

    url = "https://example.com/courses/#{course.id}/tags"

    get(url, headers: headers)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => [
        "CS",
        "Coding",
      ],
    })
  end

  it "allows adding a tag to a course" do
    course = create(:course, tags: [create(:tag, name: "CS"), create(:tag, name: "Coding")])

    user = create(:student)
    course.users << user
    headers.merge! sign_in(user)

    new_tag = create(:tag, name: "Help!")

    url = "https://example.com/courses/#{course.id}/tags/"

    params = {
      tag: "Help!",
    }.to_json

    post(url, headers: headers, params: params)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => [
        "CS",
        "Coding",
        "Help!",
      ],
    })

    expect(course.reload.tags).to include(new_tag)
  end

  it "can remove tags" do
    tag = create(:tag, name: "CS")
    course = create(:course, tags: [tag, create(:tag, name: "Coding")])

    user = create(:student)
    course.users << user
    headers.merge! sign_in(user)

    url = "https://example.com/courses/#{course.id}/tags/CS"

    delete(url, headers: headers)

    expect(response.code).to eq("200")
    expect(json).to eq({
      "data" => [
        "Coding",
      ],
    })

    expect(course.reload.tags).not_to include(tag)
  end
end
