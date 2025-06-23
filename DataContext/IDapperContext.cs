using System.Data;

namespace file_share.DataContext;

public interface IDapperContext
{
    IDbConnection CreateConnection();

}