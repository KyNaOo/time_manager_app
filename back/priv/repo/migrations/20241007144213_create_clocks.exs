defmodule TimeTracker.Repo.Migrations.CreateClocks do
  use Ecto.Migration

  def change do
    create table(:clocks) do
      add :time, :naive_datetime
      add :status, :boolean, default: false, null: false
      add :user_id, references(:users, on_delete: :delete_all)
      timestamps(type: :utc_datetime)
    end
  end
end
