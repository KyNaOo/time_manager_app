defmodule TimeTracker.Accounts.Team do
  use Ecto.Schema
  import Ecto.Changeset

  schema "teams" do
    field :title, :string
    has_many :team_members, TimeTracker.Accounts.TeamMember
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(team, attrs) do
    team
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end
end
