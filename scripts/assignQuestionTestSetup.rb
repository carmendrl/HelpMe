Professor.delete(Professor.all)
Student.delete(Student.all)
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

student = Student.create!(
  :email => "s@test.com",
  :password => "password",
  :username => "student1",
  :first_name => "Some",
  :last_name => "Student",
  :id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901"
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
  :end_date => "2022-09-09T14:22:37Z",
  :token => "9bf9f1",
  #:users_data_id => "6dd5126c-c738-41de-8513-a9dda1436c24"
)

question = Question.create!(
  :id => "b50b0fb1-7b55-40bf-9660-cf90c044dcf1",
  :text => "Will is be sunny tomorrow?",
  :status => "claimed",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session_id => "d82fabc9-0976-4f6f-8bb1-b8ec9f16a395"
)

question = Question.create!(
  :id => "2a9a48e8-736d-49a3-8386-e9419b064c15",
  :text => "Testng a question with an answer",
  :status => "answered",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session_id => "d82fabc9-0976-4f6f-8bb1-b8ec9f16a395"
)

answer = Answer.create!(
  :id => "65b34581-20cd-4e72-8410-da0adc85b299",
  :question_id => "2a9a48e8-736d-49a3-8386-e9419b064c15",
  :text => "This is an answer",
  :answerer_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :submitted => true,


)
