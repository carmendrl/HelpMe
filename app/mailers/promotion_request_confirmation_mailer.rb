class PromotionRequestConfirmationMailer < ApplicationMailer
	def promotion_request_confirmed

		@request = params[:request]

		puts "In mailer request is #{@request}"
		puts "In mail promoted_by is #{@request.promoted_by}"

		@subject = 'You are now a professor in the HelpMe App!'
		@from = "#{@request.promoted_by.first_name} #{@request.promoted_by.last_name} <#{@request.promoted_by.email}>"

		mail(
      to: @request.user.email,
      from: @from,
      subject: @subject
    )
	end
end
