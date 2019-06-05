class QuestionSerializer < ActiveModel::Serializer
  attribute :text
  attribute :created_at
  attribute :status
  attribute :faq
  attribute :step

  has_one :original_asker
  has_one :answer, if: :answered?
  has_many :askers, if: :show_askers?, key: :asked_by
  has_one :claimed_by, if: :claimed?
  has_one :lab_session

  def show_askers?
    current_user.professor? && object.askers.any?
  end

  def professor?
    current_user.professor?
  end

  def claimed?
    object.claimed?
  end

  def answered?
    object.answered?
  end
end
