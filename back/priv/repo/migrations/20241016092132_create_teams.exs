defmodule TimeTracker.Repo.Migrations.CreateTeams do
  use Ecto.Migration

  def change do
    create table(:teams) do
      add :title, :string

      timestamps(type: :utc_datetime)
    end
  end
end
