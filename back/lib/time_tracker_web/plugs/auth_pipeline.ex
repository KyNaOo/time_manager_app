defmodule TimeTrackerWeb.Plugs.AuthPipeline do
  use Guardian.Plug.Pipeline,
  otp_app: :time_tracker,
  module: TimeTracker.Guardian,
  error_handler: TimeTrackerWeb.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
