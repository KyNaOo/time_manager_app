defmodule TimeTrackerWeb.UserController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.Accounts
  alias TimeTracker.Accounts.User

  action_fallback TimeTrackerWeb.FallbackController

  def index(conn, %{"email" => email, "username" => username}) do
    case Accounts.get_user_by_email(email, username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "User not found"})

      user ->
        render(conn, :show, user: user)
    end
  end

  def index(conn, _params) do
    users = Accounts.list_users()
    render(conn, :index, users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/users/#{user}")
      |> render(:show, user: user)
    end
  end

  def show(conn, %{"user_id" => user_id}) do
    user = Accounts.get_user!(user_id)
    render(conn, :show, user: user)
  end

  def update(conn, %{"user_id" => user_id, "user" => user_params}) do
    user = Accounts.get_user!(user_id)

    with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
      render(conn, :show, user: user)
    end
  end

  def delete(conn, %{"user_id" => user_id}) do
    user = Accounts.get_user!(user_id)

    with {:ok, %User{}} <- Accounts.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
