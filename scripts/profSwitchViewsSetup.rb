Professor.delete(Professor.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

professor = Professor.create!(
  :first_name => "Prof",
  :last_name => "Test",
  :password => "password",
  :email => "prof@test.com",
  :username =>  "prof2",
  :id => "28a7de3d-97f7-478a-aa86-42bb052d03d8"
)

course = Course.create!(
  :title => "Web Design and Implementation",
  :subject => "CSCI",
  :number => "140",
  :semester => "201908",
  :instructor_id => "28a7de3d-97f7-478a-aa86-42bb052d03d8",
  :id => "f52c8de7-a263-49a4-8ab7-2081fdfaf8d0"
)


labSession = LabSession.create!(
  :description => "Test Lab 1",
  :id => "f575fb96-8aec-4e76-9eec-80c5afbd6d00",
  :active => true,
  :course_id => "f52c8de7-a263-49a4-8ab7-2081fdfaf8d0",
  :start_date => "2019-02-06T14:22:37Z",
  :end_date => "2019-09-09T14:22:37Z",
  :token => "368fa4"
)
