using System.ComponentModel.DataAnnotations;

namespace file_share.CustomAttributes;

public class CleanedFileAttribute(int MaxSizeMB, params string[] AllowedTypes) : ValidationAttribute
{
    private readonly IEnumerable<string> _AllowedTypes = AllowedTypes;
    private readonly int _MaxSizeMB = MaxSizeMB;

    protected override ValidationResult? IsValid(object? Value, ValidationContext ValidationContext)
    {
        if (Value is not IFormFile File)
        {
            return new ValidationResult("File is required.");
        }

        if (File.Length == 0 || File.Length >= _MaxSizeMB * 1024 * 1024)
        {
            return new ValidationResult($"File size must not exceed {_MaxSizeMB} MB.");
        }

        if (!_AllowedTypes.Contains("*/ALL") && !_AllowedTypes.Contains(File.ContentType))
        {
            return new ValidationResult($"File type '{File.ContentType}' is not allowed.");
        }

        return ValidationResult.Success;
    }
}
