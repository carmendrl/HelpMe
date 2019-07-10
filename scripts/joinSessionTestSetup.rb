Professor.delete(Professor.all)
Student.delete(Student.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

student = Student.create!(
  :email => "student@test.com",
  :password => "password",
  :username => "student",
  :first_name => "Student",
  :last_name => "Test"
)

professor = Professor.create!(
  :first_name => "Prof",
  :last_name => "Test",
  :password => "password",
  :email => "prof@test.com",
  :username =>  "prof3",
  :id => "cc679d55-853c-40e6-b270-9f91831f3983"
)

course = Course.create!(
  :title => "Testing Join Session",
  :subject => "Testing",
  :number => "101",
  :semester => "201908",
  :instructor_id => "cc679d55-853c-40e6-b270-9f91831f3983",
  :id => "2ceff772-c265-4df3-a670-c1f4e83c03b2"
)

labSession = LabSession.create!(
  :description => "Test Lab 2",
  :id => "7c2d3c08-7d68-4763-a428-c367466d4fbc",
  :active => true,
  :course_id => "2ceff772-c265-4df3-a670-c1f4e83c03b2",
  :start_date => "2019-02-06T14:22:37Z",
  :end_date => "2019-09-09T14:22:37Z",
  :token => "340a6f"
)

labSession2 = LabSession.create!(
  :description => "Test Lab 3",
  :id => "a7dd0984-389f-49c0-885e-8c3d6e11bd72",
  :active => true,
  :course_id => "2ceff772-c265-4df3-a670-c1f4e83c03b2",
  :start_date => "2022-02-06T14:22:37Z",
  :end_date => "2022-09-09T14:22:37Z",
  :token => "077dd8"
)
