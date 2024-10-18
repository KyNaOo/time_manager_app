defmodule TimeTracker.Guardian do
  use Guardian, otp_app: :time_tracker

  alias TimeTracker.Accounts  # Assuming you have an Accounts context that manages users

  # This function defines the subject of the token (the "sub" claim)
  # Usually, it's the user's ID.
  def subject_for_token(user, _claims) do
    # We’ll use the user's ID as the token's subject (sub)
    sub = to_string(user.id)
    {:ok, sub}
  end

  # This function retrieves the user from the token's claims.
  # The "sub" claim typically stores the user ID.
  def resource_from_claims(claims) do
    # Get the user ID (subject) from the claims
    id = claims["sub"]

    # Use your Accounts context to fetch the user
    case Accounts.get_user!(id) do
      nil -> {:error, :resource_not_found}
      user -> {:ok, user}
    end
  end
end
