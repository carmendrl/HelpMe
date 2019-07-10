Course.delete(Course.all)
Professor.delete(Professor.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

professor = Professor.create!(
  :id  => "b62353eb-2a60-4c95-b4e0-b9853df6284c",
  :first_name => "Dr.",
  :last_name => "Professor",
  :email => "prof1@test.com",
  :password => "password",
  :username =>  "prof1",
)
course = Course.create!(
  :id => "80d42a69-db29-4e0c-ad44-0eaf5610aea9",
  :title => "Testing Start Session",
  :subject => "Testing",
  :number => "102",
  :semester => "201908",
  :instructor_id => "b62353eb-2a60-4c95-b4e0-b9853df6284c",
)
