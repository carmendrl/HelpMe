class QuestionSerializer < ActiveModel::Serializer
  attribute :text
  attribute :created_at

  has_one :asker, if: :professor?, serializer: UserSerializer
  has_one :claimed_by, if: :claimed?

  def professor?
    current_user.professor?
  end

  def claimed?
    object.claimed?
  end
end
