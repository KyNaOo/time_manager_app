defmodule TimeTracker.DurationFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.Duration` context.
  """

  @doc """
  Generate a workingtime.
  """
  def workingtime_fixture(attrs \\ %{}) do
    {:ok, workingtime} =
      attrs
      |> Enum.into(%{
        end: ~N[2024-10-06 15:07:00],
        start: ~N[2024-10-06 15:07:00],
        user_id: 42
      })
      |> TimeTracker.Duration.create_workingtime()

    workingtime
  end
end
