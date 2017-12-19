class QuestionSerializer < ActiveModel::Serializer
  attribute :text
  attribute :created_at

  has_one :original_asker, if: :professor?
  has_many :askers, if: :show_askers?, key: :asked_by
  has_one :claimed_by, if: :claimed?

  def show_askers?
    current_user.professor? && object.askers.any?
  end

  def professor?
    current_user.professor?
  end

  def claimed?
    object.claimed?
  end
end
