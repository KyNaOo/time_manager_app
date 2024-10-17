defmodule TimeTracker.DurationTest do
  use TimeTracker.DataCase

  alias TimeTracker.Duration

  describe "workingtime" do
    alias TimeTracker.Duration.Workingtime

    import TimeTracker.DurationFixtures

    @invalid_attrs %{end: nil, start: nil, user_id: nil}

    @tag :skip
    test "list_workingtime/0 returns all workingtime" do
      workingtime = workingtime_fixture()
      assert Duration.list_workingtime() == [workingtime]
    end


    @tag :skip
    test "get_workingtime!/1 returns the workingtime with given id" do
      workingtime = workingtime_fixture()
      assert Duration.get_workingtime!(workingtime.id) == workingtime
    end

    @tag :skip
    test "create_workingtime/1 with valid data creates a workingtime" do
      valid_attrs = %{end: ~N[2024-10-06 15:07:00], start: ~N[2024-10-06 15:07:00], user_id: 42}

      assert {:ok, %Workingtime{} = workingtime} = Duration.create_workingtime(valid_attrs)
      assert workingtime.end == ~N[2024-10-06 15:07:00]
      assert workingtime.start == ~N[2024-10-06 15:07:00]
      assert workingtime.user_id == 42
    end

    test "create_workingtime/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Duration.create_workingtime(@invalid_attrs)
    end

    @tag :skip
    test "update_workingtime/2 with valid data updates the workingtime" do
      workingtime = workingtime_fixture()
      update_attrs = %{end: ~N[2024-10-07 15:07:00], start: ~N[2024-10-07 15:07:00], user_id: 43}

      assert {:ok, %Workingtime{} = workingtime} = Duration.update_workingtime(workingtime, update_attrs)
      assert workingtime.end == ~N[2024-10-07 15:07:00]
      assert workingtime.start == ~N[2024-10-07 15:07:00]
      assert workingtime.user_id == 43
    end

    @tag :skip
    test "update_workingtime/2 with invalid data returns error changeset" do
      workingtime = workingtime_fixture()
      assert {:error, %Ecto.Changeset{}} = Duration.update_workingtime(workingtime, @invalid_attrs)
      assert workingtime == Duration.get_workingtime!(workingtime.id)
    end

    @tag :skip
    test "delete_workingtime/1 deletes the workingtime" do
      workingtime = workingtime_fixture()
      assert {:ok, %Workingtime{}} = Duration.delete_workingtime(workingtime)
      assert_raise Ecto.NoResultsError, fn -> Duration.get_workingtime!(workingtime.id) end
    end

    @tag :skip
    test "change_workingtime/1 returns a workingtime changeset" do
      workingtime = workingtime_fixture()
      assert %Ecto.Changeset{} = Duration.change_workingtime(workingtime)
    end
  end
end
