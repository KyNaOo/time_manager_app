defmodule TimeTracker.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        username: "some username"
      })
      |> TimeTracker.Accounts.create_user()

    user
  end

  @doc """
  Generate a team.
  """
  def team_fixture(attrs \\ %{}) do
    {:ok, team} =
      attrs
      |> Enum.into(%{
        title: "some title"
      })
      |> TimeTracker.Accounts.create_team()

    team
  end
end
