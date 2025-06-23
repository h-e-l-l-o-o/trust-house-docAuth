using System.ComponentModel.DataAnnotations;

namespace file_share.CustomAttributes;

public class AllowedRolesAttribute : ValidationAttribute
{
    private static readonly HashSet<string> Allowed =
   [
       "CanWrite", "Admin", "CanRead", "CanDelete"
   ];
    protected override ValidationResult? IsValid(object? Value, ValidationContext ValidationContext)
    {
        if (Value is not string CSV)
        {
            return new ValidationResult("Invalid role input.");
        }

        var Roles = CSV.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        foreach (var Role in Roles)
        {
            if (!Allowed.Contains(Role))
            {
                return new ValidationResult($"Invalid role: '{Role}'. Allowed roles are: {string.Join(", ", Allowed)}");
            }
        }

        return ValidationResult.Success;
    }

}
