using System.Text;
using file_share.DataContext;
using file_share.Services.AuthServices;
using file_share.Services.DocTypeService;
using file_share.Services.DocumentService;
using file_share.Services.FileServices;
using file_share.Services.UserServices;
using file_share.Services.UtilitiesServices;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
//swagger
builder.Services.AddSwaggerGen();

//to get the context
builder.Services.AddHttpContextAccessor();

//custom services
builder.Services.AddSingleton<IDapperContext, DapperContext>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDocTypeService, DocTypeService>();
builder.Services.AddScoped<IUtilitiesService, UtilitiesService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IUserService, UserService>();


//swagger config for jwt
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "My API",
        Description = "An API to do awesome things"
    });

    // Security definition for JWT
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Description = "Enter your JWT with Bearer prefix, e.g., 'Bearer {token}'"
    });

    c.OperationFilter<SecurityRequirementsOperationFilter>();
});



//jwt settings 
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value!)),
        ClockSkew = TimeSpan.FromSeconds(15),
    };

    //IF WE IMPLEMENT REAL TIME
    // options.Events = new JwtBearerEvents
    // {
    //     OnMessageReceived = context =>
    //     {
    //         var accessToken = context.Request.Query["access_token"];

    //         // If the request is for our hub...
    //         var path = context.HttpContext.Request.Path;

    //         if (!string.IsNullOrEmpty(accessToken)) //&& path.StartsWithSegments("/hubs/chat"))
    //         {
    //             context.Token = accessToken;
    //         }
    //         return Task.CompletedTask;
    //     }
    // };

});

var app = builder.Build();

app.UseCors(builder =>
        builder
        .WithOrigins("http://localhost:3000", "http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
);


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
