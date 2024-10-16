defmodule TimeTrackerWeb.TeamMemberJSON do
  def render("show.json", %{team_member: team_member}) do
    %{
      id: team_member.id,
      user_id: team_member.user_id,
      team_id: team_member.team_id,
      is_team_leader: team_member.is_team_leader
    }
  end

  def render("index.json", %{team_members: team_members}) do
    %{data: Enum.map(team_members, &render("team_member.json", %{team_member: &1}))}
  end

  def render("team_member.json", %{team_member: team_member}) do
    %{
      id: team_member.id,
      user_id: team_member.user_id,
      team_id: team_member.team_id,
      is_team_leader: team_member.is_team_leader
    }
  end
  defp render_user(user) do
    %{
      id: user.id,
      username: user.username,
      is_team_leader: user.is_team_leader
    }
  end

  defp render_team(team) do
    %{
      team_id: team.team_id,
      team_name: team.team_name,
      is_team_leader: team.is_team_leader
    }
  end
end