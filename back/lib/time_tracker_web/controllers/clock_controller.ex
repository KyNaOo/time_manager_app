defmodule TimeTrackerWeb.ClockController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.Time
  alias TimeTracker.Time.Clock

  action_fallback TimeTrackerWeb.FallbackController

  def index(conn, _params) do
    clocks = Time.list_clocks(_params)
    render(conn, :index, clocks: clocks)
  end

  def create(conn, %{"user_id" => user_id }= clock_params) do
    clock_params = Map.put(clock_params, "user_id", user_id)
    with {:ok, %Clock{} = clock} <- Time.create_clock(clock_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/clocks/#{clock}")
      |> render(:show, clock: clock)
    end
  end

  def showByUser(conn, clock_params) do
    clock = Time.get_clock_by_user!(clock_params)
    render(conn, :show, clock: clock)
  end

  def show(conn, %{"id" => id}) do
    clock = Time.get_clock!(id)
    render(conn, :show, clock: clock)
  end

  def update(conn, %{"id" => id, "clock" => clock_params}) do
    clock = Time.get_clock!(id)

    with {:ok, %Clock{} = clock} <- Time.update_clock(clock, clock_params) do
      render(conn, :show, clock: clock)
    end
  end

  def delete(conn, %{"id" => id}) do
    clock = Time.get_clock!(id)

    with {:ok, %Clock{}} <- Time.delete_clock(clock) do
      send_resp(conn, :no_content, "")
    end
  end
end
