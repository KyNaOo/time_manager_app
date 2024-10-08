defmodule TimeTracker.TimeFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.Time` context.
  """

  @doc """
  Generate a clock.
  """
  def clock_fixture(attrs \\ %{}) do
    {:ok, clock} =
      attrs
      |> Enum.into(%{
        status: true,
        time: ~N[2024-10-06 15:05:00],
        user_id: 42
      })
      |> TimeTracker.Time.create_clock()

    clock
  end
end
