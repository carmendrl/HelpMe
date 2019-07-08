Professor.delete(Professor.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

professor = Professor.create!(
  :first_name => "Prof",
  :last_name => "Test",
  :password => "password",
  :email => "prof0@test.com",
  :username =>  "prof3",
  :id => "6dd5126c-c738-41de-8513-a9dda1436c24"
)

course = Course.create!(
  :title => "testing assign question",
  :subject => "Test",
  :number => "100",
  :semester => "201908",
  :instructor_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :id => "8345ff59-0d44-46a9-8bc7-f0c73f7cf903"
)

labSession = LabSession.create!(
  :description => "Test Lab 0",
  :id => "d82fabc9-0976-4f6f-8bb1-b8ec9f16a395",
  :active => true,
  :course_id => "8345ff59-0d44-46a9-8bc7-f0c73f7cf903",
  :start_date => "2019-02-06T14:22:37Z",
  :end_date => "2019-09-09T14:22:37Z",
  :token => "9bf9f1"
)

question = Question.create!(
  :text => "Will is be sunny tomorrow?",
  :status => "claimed",
  :faq => false,
  :step => "1",
  :lab_session_id => "d82fabc9-0976-4f6f-8bb1-b8ec9f16a395"
)
