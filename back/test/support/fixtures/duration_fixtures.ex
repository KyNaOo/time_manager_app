defmodule TimeTracker.DurationFixtures do
  alias TimeTracker.Accounts
  alias TimeTracker.Duration

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        username: "some username",
        email: "some@email.com",
        password: "some password",
        role: "user"
      })
      |> Accounts.create_user()

    user
  end

  def workingtime_fixture(attrs \\ %{}) do
    user = user_fixture()

    {:ok, workingtime} =
      attrs
      |> Enum.into(%{
        start: ~N[2023-01-01 12:00:00],
        end: ~N[2023-01-01 18:00:00],
        user_id: user.id
      })
      |> Duration.create_workingtime()

    workingtime
  end
end
