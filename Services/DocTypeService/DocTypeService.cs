using Dapper;
using file_share.DataContext;
using file_share.Dtos.DocType;
using Microsoft.Data.SqlClient;

namespace file_share.Services.DocTypeService;

public class DocTypeService(IDapperContext Data) : IDocTypeService
{
    private readonly IDapperContext _db = Data;
    public async Task<ServiceResponse<string>> Create(DocTypeCreateReqDto DocTypeData)
    {
        var res = new ServiceResponse<string>();
        try
        {
            using var con = _db.CreateConnection();
            await con.ExecuteAsync("SP_Create_DocType", new { DocTypeData.DocTypeDesc }, commandType: System.Data.CommandType.StoredProcedure);
        }
        catch (SqlException ex)
        {
            if (ex.Number == 51000)
            {
                res.StatusCode = 409;
                res.ErrorMessage = "DocType already exists!";
                return res;
            }

            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;
    }

    public async Task<ServiceResponse<string>> Delete(int DocTypeID)
    {
        var res = new ServiceResponse<string>();
        try
        {
            using var con = _db.CreateConnection();
            await con.ExecuteAsync("SP_Delete_DocType", new { DocTypeID }, commandType: System.Data.CommandType.StoredProcedure);
        }
        catch (SqlException ex)
        {
            if (ex.Number == 51000)
            {
                res.StatusCode = 404;
                res.ErrorMessage = "Invalid ID";
                return res;
            }


            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;
    }

    public async Task<ServiceResponse<IEnumerable<DocTypeGetResDto>>> Get()
    {
        var res = new ServiceResponse<IEnumerable<DocTypeGetResDto>>();
        try
        {
            using var con = _db.CreateConnection();
            var DocTypes = await con.QueryAsync<DocTypeGetResDto>("SP_Get_DocTypes", commandType: System.Data.CommandType.StoredProcedure);
            res.Data = DocTypes;
        }
        catch (SqlException ex)
        {
            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;
    }

    public async Task<ServiceResponse<string>> Update(DocTypeUpdateReqDto DocTypeData)
    {
        var res = new ServiceResponse<string>();
        try
        {
            using var con = _db.CreateConnection();
            await con.ExecuteAsync("SP_Update_DocType", new { DocTypeData.DocTypeID, DocTypeData.NewDocTypeDesc }, commandType: System.Data.CommandType.StoredProcedure);
        }
        catch (SqlException ex)
        {
            if (ex.Number == 51000)
            {
                res.StatusCode = 400;
                res.ErrorMessage = "DocType already exists Or invalid ID!";
                return res;
            }

            Console.WriteLine(ex);
            res.StatusCode = 500;
            res.ErrorMessage = "Something went wrong";
        }
        return res;
    }
}
