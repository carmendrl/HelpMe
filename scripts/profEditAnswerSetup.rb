Professor.delete(Professor.all)
Student.delete(Student.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

professor = Professor.create!(
  :first_name => "Dr.",
  :last_name => "Professor",
  :password => "password",
  :email => "professor@hope.edu",
  :username =>  "prof1"
)

student = Student.create!(
  :email => "s@test.com",
  :password => "password",
  :username => "student1",
  :first_name => "Some",
  :last_name => "Student"
)

course = Course.create!(
  :title => "Web Design and Implementation",
  :subject => "CSCI",
  :number => "145",
  :semester => "201901",
  :instructor => professor
)

labSession = LabSession.create!(
  :description => "Test Lab 3",
  :active => true,
  :course => course,
  :start_date => "2019-02-06T14:22:37Z",
  :end_date => "2019-09-09T14:22:37Z",
  #:token => "368fa4"
)

question = Question.create!)(
  :text => "Will is be sunny tomorrow?",
  :status => "claimed",
  :faq => false,
  :step => "1"
)
