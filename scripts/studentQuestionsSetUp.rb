User.delete(User.all)
# Professor.delete(Professor.all)
# Student.delete(Student.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)


professor = Professor.create!(
  :first_name => "Dr.",
  :last_name => "Professor",
  :password => "password",
  :email => "professor@hope.edu",
  :username =>  "prof1",
  :id => "e3e95712-3e45-4cb3-829e-a9dc134d82bb"
)

student = Student.create!(
  :email => "s@test.com",
  :password => "password",
  :username => "student1",
  :first_name => "Some",
  :last_name => "Student",
  :id => "02c37aae-4899-4f26-b2c1-c98360948506"
)

course = Course.create!(
  :title => "Test Course",
  :subject => "Test",
  :number => "123",
  :semester => "201908",
  :instructor => professor
)

labsession = LabSession.create!(
  :description => "Test Session",
  :course => course,
  :start_date => "2019-07-10",
  :end_date => "2019-07-15"
)

join = LabSessionMembership.create!(
  :lab_session => labsession,
  :user => student
)
