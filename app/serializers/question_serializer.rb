class QuestionSerializer < ActiveModel::Serializer
  attribute :text
  attribute :created_at
  has_one :asker, if: :professor?, serializer: UserSerializer

  def professor?
    current_user.professor?
  end
end
