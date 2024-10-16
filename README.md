# TimeTracker

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix



# docker

docker ps
docker images

docker run -it -p 5173:5173 --name website vuejs 

http-server dist --host 0.0.0.0 --port 5173

docker build -t 'image_name' .
docker run --name 'name' --network=back -d 'image'
docker exec -it [container-id] sh 



docker exec -it 6fe5667971ad sh

docker network connect [network] [container]


docker rm -v -f $(docker ps -qa)


psql -h localhost -p 5432 -U postgres time_tracker_dev

https://stackoverflow.com/questions/36075525/how-do-i-run-a-docker-instance-from-a-dockerfile

[network](https://docs.docker.com/reference/cli/docker/network/connect/)

https://stackoverflow.com/questions/20932357/how-to-enter-in-a-docker-container-already-running-with-a-new-tty

https://stackoverflow.com/questions/46917831/how-to-load-several-environment-variables-without-cluttering-the-dockerfile
