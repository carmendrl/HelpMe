require "rails_helper"

RSpec.describe LabSessionMembership, type: :model do
  it { is_expected.to belong_to(:lab_session) }
  it { is_expected.to belong_to(:user) }
end
