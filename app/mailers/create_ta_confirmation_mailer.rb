class CreateTaConfirmationMailer < ApplicationMailer
  def create_ta_confirmed
    @user = params[:user]
    @instructor = params[:instructor]

    @subject = 'You are now a TA in the HelpMe App!'
    @from = "#{@instructor.first_name} #{@instructor.last_name} <#{@instructor.email}>"

      @newEmail = '';
      for i in (0 ... @user.email.length)
        if i%2==1
          @newEmail += @user.email[i]
        end
        i+=1
      end

      @newEmail2 = '';
      for i in (0... @newEmail.length-1)
        i += 1
        @newEmail2 += @newEmail[i]
      end

      @newEmail2 += @newEmail[0]

      @user.password = @newEmail2[0..7]

      # generatePassword(email: string){
      #   //takes all the odd characters
      #   var newEmail: string = "";
      #   for(var i = 0; i < email.length; i++){
      #     if(i%2==1){
      #       newEmail+= email.charAt(i);
      #     }
      #   }
      #   //rotates everything to the right once
      #   var newEmail2: string = "";
      #   for(var i = 0; i < newEmail.length; i++){
      #     newEmail2 += newEmail.charAt(i+1);
      #   }
      #   //adds the first character onto the end
      #   newEmail2 += newEmail.charAt(0);
      #   return newEmail2.substring(0,8);
      # }

    mail(
      to: @user.email,
      from: @from,
      subject: @subject,
      password: @password
    )
  end
end
