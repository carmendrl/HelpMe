require "rails_helper"

RSpec.describe User do

  describe "validations" do
    before { create(:student) }
    it { is_expected.to have_many(:questions_asked) }
    it { is_expected.to have_many(:questions_claimed) }
  end

  it "is able to create a professor" do
    expect do
      create(:professor, email: "ferzle@example.com", username: "ferzle", password: "password", password_confirmation: "password")
    end.to change(Professor, :count).from(0).to(1)

    professor = User.last
    expect(professor.type).to eq("Professor")
  end

  it "is able to create a student" do
    expect do
      create(:student, email: "buttercup@example.com", username: "buttercup", password: "password", password_confirmation: "password")
    end.to change(Student, :count).from(0).to(1)

    student = User.last
    expect(student.type).to eq("Student")
  end

  describe "#professor?" do
    it "returns the correct values for students and professors" do
      professor = create(:professor)
      expect(professor.professor?).to eq(true)

      student = create(:student)
      expect(student.professor?).to eq(false)
    end
  end
end
