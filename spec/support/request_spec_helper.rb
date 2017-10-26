module RequestSpecHelper
  # Parse JSON response to ruby hash
  def json
    JSON.parse(response.body)
  end

  # Returns headers to signify that the user is signed in
  def sign_in(user)
    user.create_new_auth_token
  end

  # Check that all of the auth headers for sign-in are
  # present. If they aren't, the user isn't signed in.
  def signed_in?
    %W( Client expiry uid access-token ).each do |header|
      return false unless response.headers.include?(header)
    end
    return true
  end
end
