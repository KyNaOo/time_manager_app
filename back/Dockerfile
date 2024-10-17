# Use the official Elixir image
FROM elixir:1.14

# Install Hex + Rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Set the working directory
WORKDIR /app

# Copy the mix.exs and mix.lock files
COPY mix.exs mix.lock ./

# Install Elixir dependencies
RUN mix do deps.get

VOLUME "/app"

# Copy the rest of the application code
COPY . .

# Compile the application

RUN mix do compile

# Expose the port the app runs on
EXPOSE 4000

# Set the default command to run the Phoenix server

CMD ["bash", "-c", "mix ecto.create && mix ecto.migrate && mix phx.server"]