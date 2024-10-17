defmodule TimeTrackerWeb.ErrorJSONTest do
  use TimeTrackerWeb.ConnCase, async: true
  @moduletag :skip

  test "renders 404" do
    assert TimeTrackerWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert TimeTrackerWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end
end
