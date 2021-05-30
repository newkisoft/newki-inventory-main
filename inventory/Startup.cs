using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using inventory.Data;
using inventory.Models;
using inventory.Services;
using newkilibraries;

namespace inventory
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<WebsiteDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("WebsiteConnection")));
            var sqsUrl = new SqsUrl();

            // Get Identity Default Options
            IConfigurationSection identityDefaultOptionsConfigurationSection = Configuration.GetSection("IdentityDefaultOptions");
            Configuration.GetSection("Sqs").Bind(sqsUrl);

            services.Configure<IdentityDefaultOptions>(identityDefaultOptionsConfigurationSection);

            var identityDefaultOptions = identityDefaultOptionsConfigurationSection.Get<IdentityDefaultOptions>();

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Password settings
                options.Password.RequireDigit = identityDefaultOptions.PasswordRequireDigit;
                options.Password.RequiredLength = identityDefaultOptions.PasswordRequiredLength;
                options.Password.RequireNonAlphanumeric = identityDefaultOptions.PasswordRequireNonAlphanumeric;
                options.Password.RequireUppercase = identityDefaultOptions.PasswordRequireUppercase;
                options.Password.RequireLowercase = identityDefaultOptions.PasswordRequireLowercase;
                options.Password.RequiredUniqueChars = identityDefaultOptions.PasswordRequiredUniqueChars;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(identityDefaultOptions.LockoutDefaultLockoutTimeSpanInMinutes);
                options.Lockout.MaxFailedAccessAttempts = identityDefaultOptions.LockoutMaxFailedAccessAttempts;
                options.Lockout.AllowedForNewUsers = identityDefaultOptions.LockoutAllowedForNewUsers;

                // User settings
                options.User.RequireUniqueEmail = identityDefaultOptions.UserRequireUniqueEmail;

                // email confirmation require
                options.SignIn.RequireConfirmedEmail = identityDefaultOptions.SignInRequireConfirmedEmail;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.HttpOnly = identityDefaultOptions.CookieHttpOnly;
                options.ExpireTimeSpan = TimeSpan.FromDays(identityDefaultOptions.CookieExpiration);
                options.LoginPath = identityDefaultOptions.LoginPath; 
                options.LogoutPath = identityDefaultOptions.LogoutPath; 
                options.AccessDeniedPath = identityDefaultOptions.AccessDeniedPath; 
                options.SlidingExpiration = identityDefaultOptions.SlidingExpiration;
            });

            // Get SendGrid configuration options
            var sendGrid = new SendGridOptions();
            var demo = new Demo();
            var awsStorageConfig = new AwsStorageConfig();
            var dynamoDbConfig = new DynamoDbConfig();

            Configuration.GetSection("SendGridOptions").Bind(sendGrid);
            Configuration.GetSection("Demo").Bind(demo);
            Configuration.GetSection("AwsStorageConfig").Bind(awsStorageConfig);
            Configuration.GetSection("DynamoDbConfig").Bind(dynamoDbConfig);

            // Get SMTP configuration options
            services.Configure<SmtpOptions>(Configuration.GetSection("SmtpOptions"));

            // Get Super Admin Default options
            services.Configure<SuperAdminDefaultOptions>(Configuration.GetSection("SuperAdminDefaultOptions"));

            // Add email services.                        
            services.AddSingleton<IDemo>(demo);
            services.AddSingleton<ISendGridOptions>(sendGrid);
            services.AddSingleton<ISqsUrl>(sqsUrl);
            services.AddSingleton<IAwsStorageConfig>(awsStorageConfig);
            services.AddSingleton<IDynamoDbConfig>(dynamoDbConfig);
            services.AddTransient<IEmailSender, EmailSender>();            
            services.AddTransient<IDynamoDbContext, DynamoDbContext>();
            services.AddTransient<ICatalogueColorTable, CatalogueColorTable>();
            services.AddTransient<ILoggingService, LoggingService>();
            services.AddTransient<IAwsService, AwsService>();
            services.AddTransient<IRabbitMqService, RabbitMqService>();
            services.AddTransient<IPackageReport,PackageReport>();
            services.AddTransient<IDbContext,ApplicationDbContext>();


            services.AddTransient<IRoles, Roles>();


            services.AddControllers(option =>
            {
                option.EnableEndpointRouting = false;
                option.RespectBrowserAcceptHeader = true;
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });
            services.AddMvc();


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {            

            app.UseAuthentication();
            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("index.html");            

            app.UseDefaultFiles(options);
            app.UseStaticFiles();
            app.UseStatusCodePages(async context =>
            {
                context.HttpContext.Response.ContentType = "text/html";

                if (context.HttpContext.Response.StatusCode == 404)
                {
                    context.HttpContext.Response.Redirect("/Pallet/Index");
                }

                if(context.HttpContext.Response.StatusCode == 403)
                {
                    context.HttpContext.Response.Redirect("/Account/");
                }
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Account}/{action=Login}/{id?}");
            });


        }
    }
}
