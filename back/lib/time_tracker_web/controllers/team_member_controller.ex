defmodule TimeTrackerWeb.TeamMemberController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.Accounts
  alias TimeTracker.Accounts.TeamMember

  action_fallback TimeTrackerWeb.FallbackController

  def create(conn, %{"team_id" => team_id, "user_id" => user_id}) do
    team_member_params = %{
      "team_id" => team_id,
      "user_id" => user_id,
      "is_team_leader" => false
    }

    case Accounts.create_team_member(team_member_params) do
      {:ok, team_member} ->
        conn
        |> put_status(:created)
        |> render(:show, team_member: team_member)

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: translate_errors(changeset)})
    end
  end

  def get_teams_for_user(conn, %{"user_id" => user_id}) do
    teams = Accounts.get_teams_for_user(user_id)
    conn
    |> put_status(:ok)
    |> json(%{teams: teams})
  end

  def get_users_in_team(conn, %{"team_id" => team_id}) do
    users = Accounts.get_users_by_team(team_id)
    conn
    |> put_status(:ok)
    |> json(%{users: users})
  end

  def is_user_team_leader(conn, %{"team_id" => team_id, "user_id" => user_id}) do
    case Accounts.is_user_team_leader(team_id, user_id) do
      true -> json(conn, %{is_team_leader: true})
      false -> json(conn, %{is_team_leader: false})
    end
  end

  def update_user_role(conn, %{"team_id" => team_id, "user_id" => user_id, "is_team_leader" => is_team_leader}) do
    case Accounts.update_user_role(team_id, user_id, is_team_leader) do
      {:ok, team_member} ->
        render(conn, "team_member.json", team_member: team_member)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TimeTrackerWeb.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def remove_user_from_team(conn, %{"team_id" => team_id, "user_id" => user_id}) do
    case Accounts.remove_user_from_team(team_id, user_id) do
      {:ok, _team_member} ->
        send_resp(conn, :no_content, "")
      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Unable to remove user from team"})
    end
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
