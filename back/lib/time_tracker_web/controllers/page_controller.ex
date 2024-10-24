defmodule TimeTrackerWeb.PageController do
  use TimeTrackerWeb, :controller

  def index(conn, _params) do
    # Serve the index.html file from the "priv/static" folder
    file_path = Path.join(:code.priv_dir(:time_tracker), "static/index.html")
    send_file(conn, 200, file_path)
  end
end
