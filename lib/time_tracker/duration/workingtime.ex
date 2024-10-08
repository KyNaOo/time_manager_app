defmodule TimeTracker.Duration.Workingtime do
  use Ecto.Schema
  import Ecto.Changeset

  schema "workingtime" do
    field :end, :naive_datetime
    field :start, :naive_datetime
    belongs_to :user, :integer
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(workingtime, attrs) do
    workingtime
    |> cast(attrs, [:start, :end, :user_id])
    |> validate_required([:start, :end, :user_id])
  end
end
