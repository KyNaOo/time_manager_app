defmodule MyApp.Repo.Migrations.AddPasswordAndRoleToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :password, :string, null: false
      add :role, :string, null: false
    end
  end
end
