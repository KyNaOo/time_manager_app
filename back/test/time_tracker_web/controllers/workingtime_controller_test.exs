defmodule TimeTrackerWeb.WorkingtimeControllerTest do
  use TimeTrackerWeb.ConnCase

  import TimeTracker.DurationFixtures

  alias TimeTracker.Duration.Workingtime

  @create_attrs %{
    end: ~N[2024-10-06 15:07:00],
    start: ~N[2024-10-06 15:07:00],
    user_id: 42
  }
  @update_attrs %{
    end: ~N[2024-10-07 15:07:00],
    start: ~N[2024-10-07 15:07:00],
    user_id: 43
  }
  @invalid_attrs %{end: nil, start: nil, user_id: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all workingtime", %{conn: conn} do
      conn = get(conn, ~p"/api/workingtime")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create workingtime" do
    test "renders workingtime when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/workingtime", workingtime: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/workingtime/#{id}")

      assert %{
               "id" => ^id,
               "end" => "2024-10-06T15:07:00",
               "start" => "2024-10-06T15:07:00",
               "user_id" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/workingtime", workingtime: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update workingtime" do
    setup [:create_workingtime]

    test "renders workingtime when data is valid", %{conn: conn, workingtime: %Workingtime{id: id} = workingtime} do
      conn = put(conn, ~p"/api/workingtime/#{workingtime}", workingtime: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/workingtime/#{id}")

      assert %{
               "id" => ^id,
               "end" => "2024-10-07T15:07:00",
               "start" => "2024-10-07T15:07:00",
               "user_id" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, workingtime: workingtime} do
      conn = put(conn, ~p"/api/workingtime/#{workingtime}", workingtime: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete workingtime" do
    setup [:create_workingtime]

    test "deletes chosen workingtime", %{conn: conn, workingtime: workingtime} do
      conn = delete(conn, ~p"/api/workingtime/#{workingtime}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/workingtime/#{workingtime}")
      end
    end
  end

  defp create_workingtime(_) do
    workingtime = workingtime_fixture()
    %{workingtime: workingtime}
  end
end
