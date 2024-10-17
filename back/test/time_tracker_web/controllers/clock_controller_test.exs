defmodule TimeTracker.TimeFixtures do
  alias TimeTracker.Accounts
  alias TimeTracker.Time

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "user#{System.unique_integer()}@example.com",
        password: "some password"
      })
      |> Accounts.create_user()
    user
  end

  def clock_fixture(attrs \\ %{}) do
    user = user_fixture()
    {:ok, clock} =
      attrs
      |> Enum.into(%{
        status: true,
        time: ~N[2024-10-06 15:05:00],
        user_id: user.id
      })
      |> Time.create_clock()
    clock
  end
end
