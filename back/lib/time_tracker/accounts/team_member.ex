defmodule TimeTracker.Accounts.TeamMember do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias TimeTracker.Accounts.TeamMember
  alias TimeTracker.Repo
  alias TimeTracker.Accounts.Team
  alias TimeTracker.Accounts.User

  schema "team_members" do
    field :is_team_leader, :boolean
    belongs_to :user, TimeTracker.Accounts.User
    belongs_to :team, TimeTracker.Accounts.Team

    timestamps()
  end

  def changeset(team_member, attrs) do
    team_member
    |> cast(attrs, [:user_id, :team_id, :is_team_leader])
    |> validate_required([:user_id, :team_id, :is_team_leader])
    |> unique_constraint(:user_id, name: :team_members_user_id_team_id_index)
  end

  # def get_users_by_team(team_id) do
  #   from(tm in TeamMember,
  #     join: u in User, on: u.id == tm.user_id,
  #     where: tm.team_id == ^team_id,
  #     select: %{id: u.id, name: u.username, is_team_leader: tm.is_team_leader}
  #   )
  #   |> Repo.all()
  # end

  # def is_user_team_leader(team_id, user_id) do
  #   Repo.exists?(
  #     from(tm in TeamMember,
  #       where: tm.team_id == ^team_id and tm.user_id == ^user_id and tm.is_team_leader == true
  #     )
  #   )
  # end

  # def update_team_member(team_id, user_id, is_team_leader) do
  #   team_member = Repo.get_by(TeamMember, team_id: team_id, user_id: user_id)

  #   team_member
  #   |> TeamMember.changeset(%{is_team_leader: is_team_leader})
  #   |> Repo.update()
  # end

  # def remove_user_from_team(team_id, user_id) do
  #   team_member = Repo.get_by(TeamMember, team_id: team_id, user_id: user_id)

  #   case team_member do
  #     nil -> {:error, :not_found}
  #     _team_member -> Repo.delete(team_member)
  #   end
  # end

  # def get_teams_for_user(user_id) do
  #   from(tm in TeamMember,
  #     join: t in Team, on: t.id == tm.team_id,
  #     where: tm.user_id == ^user_id,
  #     select: %{team_id: t.id, team_name: t.title, is_team_leader: tm.is_team_leader}
  #   )
  #   |> Repo.all()
  # end
end
