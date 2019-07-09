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
  :email => "p@test.com",
  :username =>  "prof1"
)

student = Student.create!(
  :email => "s@test.com",
  :password => "password",
  :username => "student1",
  :first_name => "Some",
  :last_name => "Student"
)
