defmodule TimeTracker.Repo.Migrations.AddFieldHashedPassword do
  use Ecto.Migration

  def up do
    rename table(:users), :password, to: :password_hash
  end

  def down do
    rename table(:users), :password_hash, to: :password
  end
end
