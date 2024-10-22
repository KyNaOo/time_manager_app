defmodule TimeTrackerWeb.Router do
  use TimeTrackerWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug TimeTrackerWeb.Plugs.AuthPipeline
  end

  scope "/api", TimeTrackerWeb do
    pipe_through [:api, :auth] # By applying auth  here, all routes in this scope (/api) will require JWT-based authentication.
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

    get "/teams", TeamController, :index
    get "/team/:id", TeamController, :show
    post "/team", TeamController, :create
    put "/team/:id", TeamController, :update
    delete "/team/:id", TeamController, :delete

    post "/team/user/addUser/:user_id/:team_id", TeamMemberController, :create
    get "/team/users/:team_id", TeamMemberController, :get_users_in_team
    get "/team/user/isAdmin/:user_id/:team_id", TeamMemberController, :is_user_team_leader
    put "/team/user/role/:user_id/:team_id", TeamMemberController, :update_user_role
    delete "/team/user/remove/:user_id/:team_id", TeamMemberController, :remove_user_from_team
    get "/user/teams/:user_id", TeamMemberController, :get_teams_for_user

  end

  scope "/api", TimeTrackerWeb do
    pipe_through :api # Only the API pipeline, no auth

    # Public routes (no JWT authentication needed)
    post "/auth/signin", AuthController, :sign_in
    post "/auth/register", AuthController, :register
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
