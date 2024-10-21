defmodule TimeTracker.TimeFixtures do
  alias TimeTracker.Accounts
  alias TimeTracker.Time

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

  def clock_fixture(attrs \\ %{}) do
    user = user_fixture()

    {:ok, clock} =
      attrs
      |> Enum.into(%{
        time: ~N[2023-01-01 12:00:00],
        status: true,
        user_id: user.id
      })
      |> Time.create_clock()

    clock
  end
end
