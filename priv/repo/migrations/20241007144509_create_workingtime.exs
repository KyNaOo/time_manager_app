defmodule TimeTracker.Repo.Migrations.CreateWorkingtime do
  use Ecto.Migration

  def change do
    create table(:workingtime) do
      add :start, :naive_datetime
      add :end, :naive_datetime
      add :user_id, references(:users, on_delete: :delete_all)


      timestamps(type: :utc_datetime)
    end
  end
end
