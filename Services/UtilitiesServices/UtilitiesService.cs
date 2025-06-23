namespace file_share.Services.UtilitiesServices;

public class UtilitiesService : IUtilitiesService
{
    public bool HasRole(string? Roles, string Role)
    {
        if (Roles is null)
        {
            return false;
        }

        return Roles.Contains(Role);

    }
}
