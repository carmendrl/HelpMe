class NotifyProfessorsOfPromotionRequestMailer < ApplicationMailer
	def notify_professors_of_promotion_request
		@request = params[:request]
		@recipient = params[:recipient]

		@subject = "Please confirm #{@request.user.full_name}'s request to be a professor in the HelpMe application"

		@from = "#{@request.user.first_name} #{@request.user.last_name} <#{@request.user.email}>"
		mail(
			to: @recipient.email,
			from: @from,
			subject: @subject
		)
	end

end
