
email = 'claire.lundy+ta@hope.edu'

newEmail = '';
for i in (0 ... email.length)
  if i%2==1
    newEmail += email[i]
  end
  i+=1
end
puts newEmail
newEmail2 = '';
for i in (0... newEmail.length-1)
  i += 1
  newEmail2 += newEmail[i]
  # i += 1
end
puts newEmail2
newEmail2 += newEmail[0]
email = newEmail2[0..7]
