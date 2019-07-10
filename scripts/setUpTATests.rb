
Professor.delete(Professor.all)
Student.delete(Student.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

professor = Professor.create!(
	:first_name => "Professor",
	:last_name => "1",
	:password => "password",
	:email => "professor@hope.edu",
	:username => "prof1"
)

stu = Student.create!(
	:first_name => "Student",
	:last_name => "1",
	:password => "password",
	:email => "s@hope.edu",
	:username => "student"
)

ta = Student.create!(
	:first_name => "TA",
	:last_name => "1",
	:password => "password",
	:email => "ta@hope.edu",
	:username => "TA",
  :role => "ta",
)

course = Course.create!(
  :title => "Test Course",
  :subject => "CSCI",
  :number => "123",
  :semester => "201908",
  :instructor => professor,
)

labsession = LabSession.create!(
  :description => "Test Lab",
  :course => course,
  :start_date => "2019-06-27",
  :end_date => "2019-06-29",
)

join = LabSessionMembership.create!(
  :lab_session => labsession,
  :user => ta,
)

join1 = LabSessionMembership.create!(
  :lab_session => labsession,
  :user => stu,
)

question1 = Question.create!(
  :text => "testing question 1",
  :step => "1",
  # :original_asker => stu,
  :lab_session => labsession,
)

question2 = Question.create!(
  :text => "testing question 2",
  :step => "2",
  # :original_asker => stu,
  :lab_session => labsession,
)


question3 = Question.create!(
  :text => "testing question 3",
  :step => "3",
  # :original_asker => stu,
  :lab_session => labsession,
)


answer = Answer.create!(
  :text => "test answer",
  :answerer => professor,
  :submitted => true,
)

question3.update!(
  :answer => answer,
)
