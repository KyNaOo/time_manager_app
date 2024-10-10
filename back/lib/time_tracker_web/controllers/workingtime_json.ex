defmodule TimeTrackerWeb.WorkingtimeJSON do
  alias TimeTracker.Duration.Workingtime

  @doc """
  Renders a list of workingtime.
  """
  def index(%{workingtime: workingtime}) do
    %{data: for(workingtime <- workingtime, do: data(workingtime))}
  end

  @doc """
  Renders a single workingtime.
  """
  def show(%{workingtime: workingtime}) do
    %{data: data(workingtime)}
  end

  defp data(%Workingtime{} = workingtime) do
    %{
      id: workingtime.id,
      start: workingtime.start,
      end: workingtime.end,
      user_id: workingtime.user_id
    }
  end
end