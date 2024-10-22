# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

#if Mix.env() == :dev do
#  config :dotenv,
#    path: ".env"
#end

config :time_tracker,
  ecto_repos: [TimeTracker.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :time_tracker, TimeTrackerWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [json: TimeTrackerWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: TimeTracker.PubSub,
  live_view: [signing_salt: "D9dfpA+3"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :time_tracker, TimeTracker.Mailer, adapter: Swoosh.Adapters.Local

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason


# Configure Guardian
config :time_tracker, TimeTracker.Guardian,
  issuer: "time_tracker",
  secret_key: "McB731AHNZRsVLbxN5bPyg7T/c2GNQuQ01fQ61KIHqRthAcjko459NArATCHjF4T"  # Make sure this is a long and secure key


# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"

# Note: Do not use this value in production
# config :bcrypt_elixir, log_rounds: 12
