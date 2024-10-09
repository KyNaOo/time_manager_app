defmodule TimeTracker.Duration do
  @moduledoc """
  The Duration context.
  """

  import Ecto.Query, warn: false
  alias TimeTracker.Repo

  alias TimeTracker.Duration.Workingtime

  @doc """
  Returns the list of workingtime.

  ## Examples

      iex> list_workingtime()
      [%Workingtime{}, ...]

  """
  def list_workingtime do
    Repo.all(Workingtime)
  end



  @doc """
  Gets a single workingtime.

  Raises `Ecto.NoResultsError` if the Workingtime does not exist.

  ## Examples

      iex> get_workingtime!(123)
      %Workingtime{}

      iex> get_workingtime!(456)
      ** (Ecto.NoResultsError)

  """
  def get_workingtime!(id), do: Repo.get!(Workingtime, id)
  def find_one_workingtime!(user_id, id) do
    query = from w in Workingtime,
    where: w.id == ^id,
    where: w.user_id == ^user_id,
    select: w
    Repo.one(query)
  end

  def list_workingtimes(user_id, start_time \\ nil, end_time \\ nil) do
    query = from wt in Workingtime,
                 where: wt.user_id == ^user_id

    query = if start_time && end_time do
      from wt in query, where: wt.start == ^start_time and wt.end == ^end_time
    else
      query
    end

    Repo.all(query)
  end


  @doc """
  Creates a workingtime.

  ## Examples

      iex> create_workingtime(%{field: value})
      {:ok, %Workingtime{}}

      iex> create_workingtime(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_workingtime(attrs \\ %{}) do
    %Workingtime{}
    |> Workingtime.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a workingtime.

  ## Examples

      iex> update_workingtime(workingtime, %{field: new_value})
      {:ok, %Workingtime{}}

      iex> update_workingtime(workingtime, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_workingtime(%Workingtime{} = workingtime, attrs) do
    workingtime
    |> Workingtime.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a workingtime.

  ## Examples

      iex> delete_workingtime(workingtime)
      {:ok, %Workingtime{}}

      iex> delete_workingtime(workingtime)
      {:error, %Ecto.Changeset{}}

  """
  def delete_workingtime(%Workingtime{} = workingtime) do
    Repo.delete(workingtime)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking workingtime changes.

  ## Examples

      iex> change_workingtime(workingtime)
      %Ecto.Changeset{data: %Workingtime{}}

  """
  def change_workingtime(%Workingtime{} = workingtime, attrs \\ %{}) do
    Workingtime.changeset(workingtime, attrs)
  end
end
