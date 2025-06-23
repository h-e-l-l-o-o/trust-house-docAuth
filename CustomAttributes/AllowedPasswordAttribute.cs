using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace file_share.CustomAttributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class AllowedPasswordAttribute : ValidationAttribute
    {
        private static readonly Regex _passwordRegex = new(
            @"^(?=.{8,}$)               
              (?=.*[A-Z])               
              (?=.*[!@#$%^&*(),.?:{}|<>]) 
              .+                        
            $",
            RegexOptions.IgnorePatternWhitespace | RegexOptions.Compiled
        );

        public AllowedPasswordAttribute()
        {
            ErrorMessage =
                @"Password must be at least 8 characters long, 
                contain at least one uppercase letter, and at least one special character.";

        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var Password = value as string;

            if (string.IsNullOrEmpty(Password))
            {
                return ValidationResult.Success;
            }

            if (!_passwordRegex.IsMatch(Password))
            {
                return new ValidationResult(ErrorMessage);
            }

            return ValidationResult.Success;
        }
    }
}
