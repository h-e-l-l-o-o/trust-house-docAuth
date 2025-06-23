namespace file_share.Services;

public class ServiceResponse<T>
{
    public T? Data {get; set;}
    public string ErrorMessage {get; set;} = string.Empty;
    public int StatusCode {get; set;} = 200;
}
