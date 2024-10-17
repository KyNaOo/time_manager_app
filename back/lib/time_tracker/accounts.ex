defmodule TimeTracker.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias TimeTracker.Repo

  alias TimeTracker.Accounts.User
  alias TimeTracker.Guardian


  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)
  def get_user_by_email(email, username) do
    Repo.get_by(User, email: email, username: username)
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  @doc """
  Authenticates a user using Guardian.

  ## Examples

    iex> authenticate_user(email, password)
    {:ok, token}

    iex> authenticate_user(email, wrong_password)
    {:error, :unauthorized}

  """
  def authenticate_user(email, password) do
    user = Repo.get_by(User, email: email)

    cond do
      user && Bcrypt.check_pass(user, password) ->
        # Issue the JWT token if authentication succeeds
        {:ok, token, _claims} = Guardian.encode_and_sign(user, %{
          "user_id" => user.id,
          "username" => user.username,
          "email" => user.email
        })
      true ->
        {:error, :unauthorized}  # Return an error if credentials don't match
    end
  end

end
