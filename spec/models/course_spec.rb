require 'rails_helper'

RSpec.describe Course, type: :model do
  describe "validations" do
    it { is_expected.to belong_to(:instructor) }
    it { is_expected.to have_many(:lab_sessions) }
    it { is_expected.to have_and_belong_to_many(:users) }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:subject) }
    it { is_expected.to validate_presence_of(:number) }
    it { is_expected.to validate_presence_of(:semester) }

    it "the format of semester is correct" do
      semester = "a201708"
      course = build(:course, semester: semester)

      expect(course).not_to be_valid

      semester = "2017081"
      course = build(:course, semester: semester)

      expect(course).not_to be_valid

      semester = "201801"
      course = build(:course, semester: semester)

      expect(course).to be_valid
    end
  end

  it "can create a record" do
    expect do
      create(:course)
    end.to change(Course, :count).by(1)
  end
end
