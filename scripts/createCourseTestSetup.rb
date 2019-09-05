Professor.delete(Professor.all)
Course.delete(Course.all)
LabSession.delete(LabSession.all)
Question.delete(Question.all)
Answer.delete(Answer.all)

professor = Professor.create!(
  :first_name => "Dr.",
  :last_name => "Professor",
  :password => "password",
  :email => "professor@hope.edu",
  :username =>  "prof12"
)
