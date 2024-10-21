defmodule TimeTrackerWeb.TeamControllerTest do
  use TimeTrackerWeb.ConnCase

  import TimeTracker.AccountsFixtures

  alias TimeTracker.Accounts.Team

  @create_attrs %{
    title: "some title"
  }
  @update_attrs %{
    title: "some updated title"
  }
  @invalid_attrs %{title: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  @tag :skip

  describe "index" do
    test "lists all teams", %{conn: conn} do
      conn = get(conn, ~p"/api/teams")
      assert json_response(conn, 200)["data"] == []
    end
  end

  @tag :skip
  describe "create team" do
    test "renders team when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/teams", team: @create_attrs)
      assert %{"id" => id} = json_response(conn, 404)["data"]

      conn = get(conn, ~p"/api/teams/#{id}")

      assert %{
               "id" => ^id,
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/teams", team: @invalid_attrs)
      assert json_response(conn, 404)["errors"] != %{}
    end
  end

  @tag :skip

  describe "update team" do
    setup [:create_team]

    test "renders team when data is valid", %{conn: conn, team: %Team{id: id} = team} do
      conn = put(conn, ~p"/api/teams/#{team}", team: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/teams/#{id}")

      assert %{
               "id" => ^id,
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, team: team} do
      conn = put(conn, ~p"/api/teams/#{team}", team: @invalid_attrs)
      assert json_response(conn, 404)["errors"] != %{}
    end
  end

  @tag :skip

  describe "delete team" do
    setup [:create_team]

    test "deletes chosen team", %{conn: conn, team: team} do
      conn = delete(conn, ~p"/api/teams/#{team}")
      assert response(conn, 404)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/teams/#{team}")
      end
    end
  end

  defp create_team(_) do
    team = team_fixture()
    %{team: team}
  end
end
