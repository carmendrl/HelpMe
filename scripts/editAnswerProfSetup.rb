Answer.delete(Answer.all)

professor = Professor.create!(
  :first_name => "Dr.",
  :last_name => "Professor",
  :password => "password",
  :email => "professor@hope.edu",
  :username =>  "prof1"
)
