class CreateTaConfirmationMailer < ApplicationMailer
  def create_ta_confirmed
    @user = params[:user]
    @instructor = params[:instructor]

    @subject = 'You are now a TA in the HelpMe App!'
    @from = "#{@instructor.first_name} #{@instructor.last_name} <#{@instructor.email}>"

    mail(
      to: @user.email,
      from: @from,
      subject: @subject
    )
  end
end
