Professor.delete(Professor.all)
Student.delete(Student.all)

professor = Professor.create!(
	:first_name => "Help",
	:last_name => "Me",
	:password => "password",
	:email => "mcfall@hope.edu",
	:username => "ryanmcfall"
)

digits = 1..20

lookup = {
	1 => "One",
	2 => "Two",
	3 => "Three",
	4 => "Four",
	5 => "Five",
	6 => "Six",
	7 => "Seven",
	8 => "Eight",
	9 => "Nine",
	10 => "Ten",
	11 => "Eleven",
	12 => "Twelve",
	13 => "Thirteen",
	14 => "Fourteen",
	15 => "Fifteen",
	16 => "Sixteen",
	17 => "Seventeen",
	18 => "Eighteen",
	19 => "Nineteen",
	20 => "Twenty",
}
digits.each do |digit|
	student = Student.create!(
		:last_name => lookup[digit],
		:first_name => "Student",
    :username => "student#{digit}",
		:password => "password",
		:email => "student#{digit}@hope.edu"
	)
end
