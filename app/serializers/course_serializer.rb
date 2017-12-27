class CourseSerializer < ActiveModel::Serializer
  attribute :title
  attribute :subject
  attribute :number
  attribute :semester

  belongs_to :instructor, type: "professors", if: :instructor?

  def instructor?
    object.instructor.present?
  end
end
