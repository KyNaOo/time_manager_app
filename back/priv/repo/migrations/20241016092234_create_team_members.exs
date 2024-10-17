defmodule TimeTracker.Repo.Migrations.CreateTeamMembers do
  use Ecto.Migration

  def change do
    create table(:team_members) do
      add :user_id, references(:users, on_delete: :delete_all)
      add :team_id, references(:teams, on_delete: :delete_all)
      add :is_team_leader, :boolean, default: false

      timestamps()
    end

    create index(:team_members, [:user_id])
    create index(:team_members, [:team_id])
    create unique_index(:team_members, [:user_id, :team_id])
  end
end
