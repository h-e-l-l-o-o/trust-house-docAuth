using System.Data;
using Microsoft.Data.SqlClient;

namespace file_share.DataContext;

public class DapperContext(IConfiguration Config) : IDapperContext
{
    private readonly IConfiguration _conf = Config;

    public IDbConnection CreateConnection()
    {
        return new SqlConnection(_conf.GetConnectionString("DefaultConnection"));
    }
}