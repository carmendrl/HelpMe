Answer.delete(Answer.all)
Question.delete(Question.all)
LabSession.delete(LabSession.all)
Course.delete(Course.all)
Professor.delete(Professor.all)
Student.delete(Student.all)

professor = Professor.create!(
  :first_name => "Olive",
  :last_name => "Grosspoint",
  :password => "password",
  :email => "prof@hope.edu",
  :username =>  "glitterGurl",
  :id => "6dd5126c-c738-41de-8513-a9dda1436c24"
)

student = Student.create!(
  :email => "student@hope.edu",
  :password => "password",
  :username => "student1",
  :first_name => "Murphy",
  :last_name => "Claire",
  :id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901"
)

course = Course.create!(
  :title => "testing assign question",
  :subject => "Test",
  :number => "100",
  :semester => "201908",
  :instructor_id => "6dd5126c-c738-41de-8513-a9dda1436c24", #professor.id
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

joinProfessor = LabSessionMembership.create!(
  :lab_session => labsession,
  :user => professor,
)

joinStudent = LabSessionMembership.create!(
  :lab_session => labsession,
  :user => student,
)

#4 unclaimed questions
question = Question.create!(
  #:lab_session_id => "d82fabc9-0976-4f6f-8bb1-b8ec9f16a395",
  :id => "f68d7b5b-1792-4021-8e04-e02e212b677f" ,
  :text => "This is Question 0",
  :status => "pending",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
question = Question.create!(
  :id => "0a360b66-1d11-466e-ac42-d978543084cd",
  :text => "This is Question 1",
  :status => "pending",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
question = Question.create!(
  :id => "4045f58d-6ca4-49cf-9b9a-c9851d5f2c1b",
  :text => "This is Question 2",
  :status => "pending",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
question = Question.create!(
  :id => "4ec0af60-8afc-4cbe-ad1a-4bcf3738dee6",
  :text => "This is Question 3",
  :status => "pending",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
#3 claimed questions
question = Question.create!(
  :id => "b50b0fb1-7b55-40bf-9660-cf90c044dcf1",
  :text => "This is Question 4",
  :status => "claimed",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
question = Question.create!(
  :id => "ba19fcca-67f2-4728-9963-9163d60d63f8",
  :text => "This is Question 5",
  :status => "claimed",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
question = Question.create!(
  :id => "d475545d-70bb-4888-8bb8-c24de7ff3677",
  :text => "This is Question 6",
  :status => "claimed",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)
#3questions in other
question = Question.create!(
  :id => "2a9a48e8-736d-49a3-8386-e9419b064c15",
  :text => "This is Question 7",
  :status => "answered",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)

answer = Answer.create!(
  :id => "65b34581-20cd-4e72-8410-da0adc85b299",
  :question_id => "2a9a48e8-736d-49a3-8386-e9419b064c15",
  :text => "This is the answer for Question 7",
  :answerer_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :submitted => true,
)

question = Question.create!(
  :id => "b5350d52-3dd3-4f01-b223-4a412205c34f",
  :text => "This is Question 8",
  :status => "answered",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)

answer = Answer.create!(
  :id => "408eb75b-a5bd-4e68-9dd4-6e8bacf355ae",
  :question_id => "b5350d52-3dd3-4f01-b223-4a412205c34f",
  :text => "This is the answer for Question 8",
  :answerer_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :submitted => true,
)

question = Question.create!(
  :id => "89e1a086-45a9-4d9d-b351-03bba5c78a2a",
  :text => "This is Question 9",
  :status => "answered",
  :claimed_by_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :original_asker_id => "94c1bfa7-8d13-4e7a-acad-9eda4d627901",
  :faq => false,
  :step => "1",
  :lab_session => labSession
)

answer = Answer.create!(
  :id => "0f715442-0102-4434-9c6e-3a0cd7ca8154",
  :question_id => "89e1a086-45a9-4d9d-b351-03bba5c78a2a",
  :text => "This is the answer for Question 9",
  :answerer_id => "6dd5126c-c738-41de-8513-a9dda1436c24",
  :submitted => true,
)
