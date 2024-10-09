defmodule TimeTrackerWeb.WorkingtimeController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.Duration
  alias TimeTracker.Duration.Workingtime

  action_fallback TimeTrackerWeb.FallbackController

  def index(conn, %{"user_id" => user_id} = params) do
    start_time = Map.get(params, "start")
    end_time = Map.get(params, "end")

    workingtime = Duration.list_workingtimes(user_id, start_time, end_time)
    render(conn, :index, workingtime: workingtime)
  end

  def index(conn, _params) do
    workingtime = Duration.list_workingtime()
    render(conn, :index, workingtime: workingtime)
  end

  def create(conn, %{"user_id" => user_id }= workingtime_params) do
    workingtime_params = Map.put(workingtime_params, "user_id", user_id)
    with {:ok, %Workingtime{} = workingtime} <- Duration.create_workingtime(workingtime_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/workingtime/#{workingtime}")
      |> render(:show, workingtime: workingtime)
    end
  end

  def show(conn, %{"id" => id}) do
    workingtime = Duration.get_workingtime!(id)
    render(conn, :show, workingtime: workingtime)
  end

  def update(conn, %{"id" => id, "workingtime" => workingtime_params}) do
    workingtime = Duration.get_workingtime!(id)

    with {:ok, %Workingtime{} = workingtime} <- Duration.update_workingtime(workingtime, workingtime_params) do
      render(conn, :show, workingtime: workingtime)
    end
  end

  def delete(conn, %{"id" => id}) do
    workingtime = Duration.get_workingtime!(id)

    with {:ok, %Workingtime{}} <- Duration.delete_workingtime(workingtime) do
      send_resp(conn, :no_content, "")
    end
  end

  def getone(conn, %{"user_id" => user_id, "id"=>id}) do
    workingtime = Duration.find_one_workingtime!(user_id,id)
    render(conn, :show, workingtime: workingtime)
  end
end
