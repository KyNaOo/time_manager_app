defmodule TimeTrackerWeb.AuthController do
  use TimeTrackerWeb, :controller
  alias TimeTracker.{Accounts, Guardian}



  def sign_in(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, token} ->
        json(conn, %{token: token})  # Return only the token in the response

      {:error, reason} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: reason})
    end
  end


  # POST /api/auth/register
  def register(conn, %{"email" => email, "username" => username, "password" => password, "role" => role}) do
    case Accounts.create_user(%{email: email, username: username, password: password, role: role}) do
      {:ok, user} ->
        # Issue the JWT token
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        # Extract only the necessary fields for the response
        user_data = %{
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }

        # Return the token and the filtered user data
        json(conn, %{token: token, user: user_data})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})
    end
  end
end
