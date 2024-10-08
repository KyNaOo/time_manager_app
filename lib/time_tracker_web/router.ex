defmodule TimeTrackerWeb.Router do
  use TimeTrackerWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TimeTrackerWeb do
    pipe_through :api

    get "/users", UserController, :index
    get "/users/:user_id", UserController, :show
    post "/users", UserController, :create
    put "/users/:user_id", UserController, :update
    delete "/users/:user_id", UserController, :delete

    get "/workingtime/:user_id", WorkingtimeController, :index
    post "/workingtime/:user_id", WorkingtimeController, :create
    get "/workingtime/:user_id/:id", WorkingtimeController, :getone
    put "/workingtime/:id", WorkingtimeController, :update
    delete "/workingtime/:id", WorkingtimeController, :delete

    get "/clocks/:user_id", ClockController, :index
    post "/clocks/:user_id", ClockController, :create
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:time_tracker, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: TimeTrackerWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
