defmodule TimeTrackerWeb.AuthErrorHandler do
  import Plug.Conn

  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {type, _reason}, _opts) do
    message = case type do
      :unauthenticated -> "You need to log in to access this resource."
      :invalid_token -> "Your session has expired or the token is invalid."
      _ -> "Access denied."
    end

    body = %{error: message}
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(401, Jason.encode!(body))
  end

end
