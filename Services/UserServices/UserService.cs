using Dapper;
using file_share.DataContext;
using file_share.Dtos.User;
using Microsoft.Data.SqlClient;

namespace file_share.Services.UserServices;

public class UserService(IDapperContext Data) : IUserService
{
    private readonly IDapperContext _db = Data;

    public async Task<ServiceResponse<string>> Create(UserCreateReqDto UserData)
    {
        var res = new ServiceResponse<string>();
        try
        {
            var Hash = BCrypt.Net.BCrypt.HashPassword(UserData.Password);

            var Parameters = new DynamicParameters();
            Parameters.Add("@UserName", UserData.UserName);
            Parameters.Add("@Email", UserData.Email);
            Parameters.Add("@EmpFName", UserData.EmployeeFirstName);
            Parameters.Add("@EmpSName", UserData.EmployeeSecondName);
            Parameters.Add("@EmpThName", UserData.EmployeeThirdName);
            Parameters.Add("@EmpFmName", UserData.EmployeeFourthName);
            Parameters.Add("@Password", Hash);
            Parameters.Add("@IDNo", UserData.IDNumber);
            Parameters.Add("@IDDate", UserData.IDDate);

            using var con = _db.CreateConnection();
            await con.ExecuteAsync("SP_Create_User", Parameters, commandType: System.Data.CommandType.StoredProcedure);
            res.Data = "Created";
        }
        catch (SqlException ex)
        {
            if (ex.Number == 51000)
            {
                res.StatusCode = 409;
                res.ErrorMessage = "User already exists!";
                return res;
            }


            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;
    }

    public async Task<ServiceResponse<string>> Delete(int UserID)
    {
        var res = new ServiceResponse<string>();

        try
        {

            using var con = _db.CreateConnection();
            await con.ExecuteAsync("SP_Delete_User", new { UserID }, commandType: System.Data.CommandType.StoredProcedure);
            res.Data = "Deleted";

        }
        catch (SqlException ex)
        {
            if (ex.Number == 50001)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "User already exists!";
                return res;
            }

            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;

    }

    public async Task<ServiceResponse<IEnumerable<UserGetResDto>>> Get(int UserID)
    {
        var res = new ServiceResponse<IEnumerable<UserGetResDto>>();

        try
        {
            var Parameters = new DynamicParameters();
            Parameters.Add("@UserID", UserID == 0 ? null : UserID);

            using var con = _db.CreateConnection();
            var Users = await con.QueryAsync<UserGetResDto>("SP_Get_User", Parameters, commandType: System.Data.CommandType.StoredProcedure);
            res.Data = Users;

            return res;
        }
        catch (SqlException ex)
        {
            if (ex.Number == 50001)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "User already exists!";
                return res;
            }

            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;
    }
}
