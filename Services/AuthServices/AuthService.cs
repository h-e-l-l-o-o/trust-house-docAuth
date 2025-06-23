using System.Data;
using System.Security.Cryptography;
using Dapper;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using file_share.DataContext;
using file_share.Dtos.AuthDtos;
using Microsoft.Data.SqlClient;


namespace file_share.Services.AuthServices;

public class AuthService(IDapperContext Data, IHttpContextAccessor Context, IConfiguration Config) : IAuthService
{
    private readonly IDapperContext _db = Data;
    private readonly IHttpContextAccessor _HttpContext = Context;
    private readonly IConfiguration _Config = Config;

    public async Task<ServiceResponse<int>> Login(LoginReqDto LoginInfo)
    {
        var res = new ServiceResponse<int>();

        try
        {
            using var con = _db.CreateConnection();
            con.Open();



            var UserData = await con.QueryFirstOrDefaultAsync<LoginInfoQueryResDto>(@"SELECT UserID, Password FROM TBL_Users WHERE Email = @Email", new { LoginInfo.Email });

            if (UserData is null)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "Invalid user email";
                return res;
            }

            // if (!BCrypt.Net.BCrypt.Verify(LoginInfo.Password, UserData.Hash))
            // {
            //     res.StatusCode = 401;
            //     res.ErrorMessage = "Wrong Password!";
            //     return res;
            // }

            RefreshToken NewRefreshToken = CreateRefreshToken(UserData.UserID);

            var Parameters = new DynamicParameters();

            Parameters.Add("@@ExpirationDate", NewRefreshToken.ExpiresAt, DbType.Date);
            Parameters.Add("@@CreationDate", NewRefreshToken.CreatedAt, DbType.Date);
            Parameters.Add("@UserID", UserData.UserID, DbType.Int32);
            Parameters.Add("@TokenID", NewRefreshToken.Token, DbType.String);
            Parameters.Add("@DeviceID", LoginInfo.DeviceID, DbType.String);

            await con.ExecuteAsync("SP_Set_User_Token", Parameters);

            SetRefreshToken(NewRefreshToken);

            res.Data = UserData.UserID;
            return res;

        }
        catch (SqlException e)
        {

            Console.WriteLine(e);
            res.StatusCode = 500;
            res.ErrorMessage = "Something Went Wrong";
            return res;
        }
    }

    public async Task<ServiceResponse<string>> GetToken()
    {
        var Token = _HttpContext.HttpContext?.Request.Cookies["refreshToken"];
        var UserID = _HttpContext.HttpContext?.Request.Cookies["userID"];
        var res = new ServiceResponse<string>();

        if (string.IsNullOrEmpty(Token) || string.IsNullOrEmpty(UserID))
        {
            res.StatusCode = 401;
            res.ErrorMessage = "Token or User ID is missing!";
            return res;
        }

        try
        {
            using var con = _db.CreateConnection();
            con.Open();

            string GetRolesQuery = @"
            SELECT 
                ur.UserRoleDesc
            FROM 
                TBL_Users u
            LEFT JOIN 
                TBL_UserToken ut ON (u.UserID = ut.UserID AND ut.TokenID = @TokenID)
            LEFT JOIN 
                TBL_LK_UserRole ur ON u.UserID = ur.UserID
            WHERE 
                u.UserID = @UserID 
                AND u.IsActive = 1
                AND ut.IsActive = 1
                AND ur.IsActive = 1
                AND ut.ExpirationDate > GETDATE();
            ";

            var Parameters = new DynamicParameters();
            Parameters.Add("UserID", int.Parse(UserID), DbType.Int32);
            Parameters.Add("TokenID", Token, DbType.String);

            var Roles = await con.QueryAsync<string>(GetRolesQuery, Parameters);

            string JWT = CreateToken(UserID, Roles);
            res.Data = JWT;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong during the token validation.";
        }

        return res;
    }

    public async Task<ServiceResponse<string>> SetUserRole(UserRoleReqDto UserData)
    {
        var res = new ServiceResponse<string>();


        try
        {
            using var con = _db.CreateConnection();
            con.Open();


            var Parameters = new DynamicParameters();
            Parameters.Add("@UserID", UserData.UserID, DbType.Int32);
            Parameters.Add("@RolesCSV", UserData.RolesCSV, DbType.String);

            await con.ExecuteScalarAsync("EXEC SP_Set_Roles @UserID, @RolesCSV", Parameters);
            res.Data = "Done";

            return res;

        }
        catch (SqlException e)
        {
            if (e.SqlState == "547")
            {
                res.StatusCode = 404;
                res.ErrorMessage = "Invalid UserID";
                return res;
            }

            res.StatusCode = 500;
            res.ErrorMessage = "Something Went Wrong";
            return res;
        }
    }

    private string CreateToken(string ID, IEnumerable<string>? Roles)
    {

        string RolesJson = System.Text.Json.JsonSerializer.Serialize(Roles);

        List<Claim> Claims =
        [
            new Claim("UserID", ID),
        new Claim("Roles", RolesJson)
        ];

        var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_Config.GetSection("AppSettings:Token").Value!));
        var Creds = new SigningCredentials(Key, SecurityAlgorithms.HmacSha256Signature);

        var Token = new JwtSecurityToken(
            claims: Claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: Creds
        );

        var JWT = new JwtSecurityTokenHandler().WriteToken(Token);
        return JWT;
    }

    private static RefreshToken CreateRefreshToken(int UserID)
    {
        RefreshToken refresh = new()
        {
            UserId = UserID,
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };

        return refresh;
    }

    private void SetRefreshToken(RefreshToken refresh)
    {
        CookieOptions RefreshCookOpt = new()
        {
            HttpOnly = true,
            Expires = refresh.ExpiresAt,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
            IsEssential = true,
            Secure = true,
            MaxAge = TimeSpan.FromDays(30),

        };

        CookieOptions UserIDCookOpt = new()
        {
            HttpOnly = true,
            Expires = refresh.ExpiresAt,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
            IsEssential = true,
            Secure = true,
            MaxAge = TimeSpan.FromDays(30),
        };

        RefreshCookOpt.Extensions.Add("Partitioned");
        UserIDCookOpt.Extensions.Add("Partitioned");

        _HttpContext.HttpContext?.Response.Cookies.Append("refreshToken", refresh.Token, RefreshCookOpt);
        _HttpContext.HttpContext?.Response.Cookies.Append("userID", refresh.UserId.ToString(), UserIDCookOpt);

    }

}
