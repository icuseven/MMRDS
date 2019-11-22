using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Akka.Actor;
using Akka.Quartz.Actor;
using Swashbuckle.AspNetCore.Swagger;
using Quartz;
using Quartz.Impl;
using Serilog;
using Serilog.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Claims;
using Newtonsoft.Json.Linq;


namespace mmria.server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Program.DateOfLastChange_Sequence_Call = new List<DateTime> ();
            Program.Change_Sequence_Call_Count++;
            Program.DateOfLastChange_Sequence_Call.Add (DateTime.Now);

            Program.config_geocode_api_key = "";
            Program.config_geocode_api_url = "";

            if(!string.IsNullOrEmpty(Configuration["mmria_settings:is_schedule_enabled"]))
            {
                bool.TryParse(Configuration["mmria_settings:is_schedule_enabled"], out Program.is_schedule_enabled);
            }

            if(!string.IsNullOrEmpty(Configuration["mmria_settings:is_db_check_enabled"]))
            {
                bool.TryParse(Configuration["mmria_settings:is_db_check_enabled"], out Program.is_db_check_enabled);
            }


            if(!string.IsNullOrEmpty(Configuration["mmria_settings:grantee_name"]))
            {
                Program.grantee_name = Configuration["mmria_settings:grantee_name"];
            }

            if(!string.IsNullOrEmpty(Configuration["mmria_settings:metadata_version"]))
            {
                Program.metadata_release_version_name = Configuration["mmria_settings:metadata_version"];
            }



            var test_int = 0;
            //Program.config_geocode_api_key = configuration["mmria_settings:geocode_api_key"];
            //Program.config_geocode_api_url = configuration["mmria_settings:geocode_api_url"];
            Program.config_couchdb_url = Configuration["mmria_settings:couchdb_url"];
            Program.config_web_site_url = Configuration["mmria_settings:web_site_url"];
            //Program.config_file_root_folder = configuration["mmria_settings:file_root_folder"];
            Program.config_timer_user_name = Configuration["mmria_settings:timer_user_name"];
            Program.config_timer_value = Configuration["mmria_settings:timer_password"];
            Program.config_cron_schedule = Configuration["mmria_settings:cron_schedule"];
            Program.config_export_directory = Configuration["mmria_settings:export_directory"];

            Program.config_session_idle_timeout_minutes = Configuration["mmria_settings:session_idle_timeout"] != null && int.TryParse(Configuration["mmria_settings:session_idle_timeout"], out test_int) ? test_int : 30;


            Program.config_pass_word_minimum_length = string.IsNullOrWhiteSpace(Configuration["password_settings:minimum_length"])? 8: int.Parse(Configuration["password_settings:minimum_length"]);
            Program.config_pass_word_days_before_expires = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_expires"])? 0: int.Parse(Configuration["password_settings:days_before_expires"]);
            Program.config_pass_word_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_user_is_notified_of_expiration"])? 0: int.Parse(Configuration["password_settings:days_before_user_is_notified_of_expiration"]);
            

            /*
            Program.config_EMAIL_USE_AUTHENTICATION = Configuration["mmria_settings:EMAIL_USE_AUTHENTICATION"];
            Program.config_EMAIL_USE_SSL = Configuration["mmria_settings:EMAIL_USE_SSL"];
            Program.config_SMTP_HOST = Configuration["mmria_settings:SMTP_HOST"];
            Program.config_SMTP_PORT = Configuration["mmria_settings:SMTP_PORT"];
            Program.config_EMAIL_FROM = Configuration["mmria_settings:EMAIL_FROM"];
            Program.config_EMAIL_PASSWORD = Configuration["mmria_settings:EMAIL_PASSWORD"];
            */
            Program.config_default_days_in_effective_date_interval = string.IsNullOrWhiteSpace(Configuration["authentication_settings:default_days_in_effective_date_interval"])? 0: int.Parse(Configuration["authentication_settings:default_days_in_effective_date_interval"]);
            Program.config_unsuccessful_login_attempts_number_before_lockout = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"])? 5:int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"]);
            Program.config_unsuccessful_login_attempts_within_number_of_minutes = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"])? 120:int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"]);
            Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"])? 15:int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]);



            if (bool.Parse (Configuration["mmria_settings:is_environment_based"])) 
            {
                Log.Information ("using Environment");

                
                //Log.Information ("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_key"));
                //Log.Information ("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_url"));
                Log.Information ("couchdb_url: {0}", System.Environment.GetEnvironmentVariable ("couchdb_url"));
                Log.Information ("web_site_url: {0}", System.Environment.GetEnvironmentVariable ("web_site_url"));
                Log.Information ("export_directory: {0}", System.Environment.GetEnvironmentVariable ("export_directory"));

                //Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
                //Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable ("geocode_api_url");
                Program.config_couchdb_url = System.Environment.GetEnvironmentVariable ("couchdb_url");
                Program.config_web_site_url = System.Environment.GetEnvironmentVariable ("web_site_url");
                //Program.config_file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
                Program.config_timer_user_name = System.Environment.GetEnvironmentVariable ("timer_user_name");
                Program.config_timer_value = System.Environment.GetEnvironmentVariable ("timer_password");
                Program.config_cron_schedule = System.Environment.GetEnvironmentVariable ("cron_schedule");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable ("export_directory") != null ? System.Environment.GetEnvironmentVariable ("export_directory") : "/workspace/export";

                Configuration["mmria_settings:export_directory"] = Program.config_export_directory;


                //

                Program.config_session_idle_timeout_minutes = System.Environment.GetEnvironmentVariable ("session_idle_timeout") != null && int.TryParse(System.Environment.GetEnvironmentVariable ("session_idle_timeout"), out test_int) ? test_int : 30;


                Program.config_pass_word_minimum_length = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("password_minimum_length"))? 8: int.Parse(System.Environment.GetEnvironmentVariable ("password_minimum_length"));
                Program.config_pass_word_days_before_expires = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("password_days_before_expires"))? 0: int.Parse(System.Environment.GetEnvironmentVariable ("password_days_before_expires"));
                Program.config_pass_word_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("password_days_before_user_is_notified_of_expiration"))? 0: int.Parse(System.Environment.GetEnvironmentVariable ("password_days_before_user_is_notified_of_expiration"));

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_endpoint_authorization")))
                {
                    Configuration["sams:endpoint_authorization"] = System.Environment.GetEnvironmentVariable ("sams_endpoint_authorization");
                }


                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("use_development_settings")))
                {
                    Configuration["mmria_settings:is_development"] = System.Environment.GetEnvironmentVariable ("use_development_settings");
                }
                

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("metadata_version")))
                {
                    Configuration["mmria_settings:metadata_version"] = System.Environment.GetEnvironmentVariable ("metadata_version");
                }


                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_endpoint_token")))
                {
                    Configuration["sams:endpoint_token"] = System.Environment.GetEnvironmentVariable ("sams_endpoint_token");
                }
                

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_endpoint_user_info")))
                {
                    Configuration["sams:endpoint_user_info"] =  System.Environment.GetEnvironmentVariable ("sams_endpoint_user_info");
                }
                

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_endpoint_token_validation")))
                {
                    Configuration["sams:token_validation"] = System.Environment.GetEnvironmentVariable ("sams_endpoint_token_validation");
                }
                

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_endpoint_user_info_sys")))
                {
                    Configuration["sams:user_info_sys"] = System.Environment.GetEnvironmentVariable ("sams_endpoint_user_info_sys");
                }
                

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_client_id")))
                {
                    Configuration["sams:client_id"] = System.Environment.GetEnvironmentVariable ("sams_client_id");
                }
                

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_client_secret")))
                {
                    Configuration["sams:client_secret"] = System.Environment.GetEnvironmentVariable ("sams_client_secret");
                }

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_callback_url")))
                {
                    Configuration["sams:callback_url"] = System.Environment.GetEnvironmentVariable ("sams_callback_url");
                }
            
                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_logout_url")))
                {
                    Configuration["sams:logout_url"] = System.Environment.GetEnvironmentVariable ("sams_logout_url");
                }

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("sams_is_enabled")))
                {
                    Configuration["sams:is_enabled"] = System.Environment.GetEnvironmentVariable ("sams_is_enabled");
                }


                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("is_schedule_enabled"))&& bool.TryParse(System.Environment.GetEnvironmentVariable ("is_schedule_enabled"), out Program.is_schedule_enabled))
                {
                    Configuration["is_schedule_enabled"] = System.Environment.GetEnvironmentVariable ("is_schedule_enabled");
                }

                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("is_db_check_enabled"))&& bool.TryParse(System.Environment.GetEnvironmentVariable ("is_db_check_enabled"), out Program.is_db_check_enabled))
                {
                    Configuration["is_db_check_enabled"] = System.Environment.GetEnvironmentVariable ("is_db_check_enabled");
                }


                if(!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("grantee_name")))
                {
                    Configuration["grantee_name"] = System.Environment.GetEnvironmentVariable ("grantee_name");
                    Program.grantee_name = Configuration["grantee_name"];
                }

                /*
                Program.config_EMAIL_USE_AUTHENTICATION = System.Environment.GetEnvironmentVariable ("EMAIL_USE_AUTHENTICATION"); //  = true;
                Program.config_EMAIL_USE_SSL = System.Environment.GetEnvironmentVariable ("EMAIL_USE_SSL"); //  = true;
                Program.config_SMTP_HOST = System.Environment.GetEnvironmentVariable ("SMTP_HOST"); //  = null;
                Program.config_SMTP_PORT = System.Environment.GetEnvironmentVariable ("SMTP_PORT"); //  = 587;
                Program.config_EMAIL_FROM = System.Environment.GetEnvironmentVariable ("EMAIL_FROM"); //  = null;
                Program.config_EMAIL_PASSWORD = System.Environment.GetEnvironmentVariable ("EMAIL_PASSWORD"); //  = null;
                */
                Program.config_default_days_in_effective_date_interval = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("default_days_in_effective_date_interval"))? 90:int.Parse(System.Environment.GetEnvironmentVariable ("default_days_in_effective_date_interval"));
                Program.config_unsuccessful_login_attempts_number_before_lockout = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("unsuccessful_login_attempts_number_before_lockout"))? 5:int.Parse(System.Environment.GetEnvironmentVariable ("unsuccessful_login_attempts_number_before_lockout"));
                Program.config_unsuccessful_login_attempts_within_number_of_minutes = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("unsuccessful_login_attempts_within_number_of_minutes"))? 120:int.Parse(System.Environment.GetEnvironmentVariable ("unsuccessful_login_attempts_within_number_of_minutes"));
                Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("unsuccessful_login_attempts_lockout_number_of_minutes"))? 15:int.Parse(System.Environment.GetEnvironmentVariable ("unsuccessful_login_attempts_lockout_number_of_minutes"));

            }



            Log.Information($"Program.config_timer_user_name = {Program.config_timer_user_name}");
            Log.Information($"Program.config_couchdb_url = {Program.config_couchdb_url}");
            Log.Information($"Logging = {Configuration["Logging:IncludeScopes"]}");
            Log.Information($"Console = {Configuration["Console:LogLevel:Default"]}");
            Log.Information ("sams:callback_url: {0}", Configuration["sams:callback_url"]);
            Log.Information ("sams:activity_name: {0}", Configuration["sams:activity_name"]);
            Log.Information ("mmria_settings:is_schedule_enabled: {0}", Configuration["mmria_settings:is_schedule_enabled"]);
            Log.Information ("mmria_settings:is_db_check_enabled: {0}", Configuration["mmria_settings:is_db_check_enabled"]);
            Log.Information ("mmria_settings:is_development: {0}", Configuration["mmria_settings:is_development"]);
            Log.Information ("mmria_settings:metadata_version: {0}", Configuration["mmria_settings:metadata_version"]);



            Program.actorSystem = ActorSystem.Create("mmria-actor-system");
            services.AddSingleton(typeof(ActorSystem), (serviceProvider) => Program.actorSystem);

            ISchedulerFactory schedFact = new StdSchedulerFactory();
            Quartz.IScheduler sched = schedFact.GetScheduler().Result;

            // compute a time that is on the next round minute
            DateTimeOffset runTime = DateBuilder.EvenMinuteDate(DateTimeOffset.UtcNow);

            // define the job and tie it to our HelloJob class
            IJobDetail job = JobBuilder.Create< mmria.server.model.Pulse_job>()
                .WithIdentity("job1", "group1")
                .Build();

            // Trigger the job to run on the next round minute
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("trigger1", "group1")
                .StartAt(runTime.AddMinutes(3))
                .WithCronSchedule (Program.config_cron_schedule)
                .Build();

            sched.ScheduleJob(job, trigger);

            if(Program.is_schedule_enabled)
            {
                sched.Start();
            }
            
 
            var quartzSupervisor = Program.actorSystem.ActorOf(Props.Create<mmria.server.model.actor.QuartzSupervisor>(), "QuartzSupervisor");
            quartzSupervisor.Tell("init");

            var use_sams = false;
            
            if(!string.IsNullOrWhiteSpace(Configuration["sams:is_enabled"]))
            {
                bool.TryParse(Configuration["sams:is_enabled"], out use_sams);
            }

/*
            //https://docs.microsoft.com/en-us/aspnet/core/fundamentals/app-state?view=aspnetcore-2.2
            services.AddDistributedMemoryCache();
            services.AddSession(opts =>
            {
                opts.Cookie.HttpOnly = true;
                opts.Cookie.Name = ".mmria.session";
                opts.IdleTimeout = TimeSpan.FromMinutes(Program.config_session_idle_timeout_minutes);
            });
 */
            if(use_sams)
            {
                Log.Information ("using sams");

                if(Configuration["mmria_settings:is_development"]!= null && Configuration["mmria_settings:is_development"] == "true")
                {

                    Log.Information ("using sams and is_development");
                    //https://github.com/jerriepelser-blog/AspnetCoreGitHubAuth/blob/master/AspNetCoreGitHubAuth/

                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/SignIn");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.Strict;
                                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                                options.Events = get_sams_authentication_events();

                                Log.Information ("options.Cookie.SameSite: {0}", options.Cookie.SameSite);
                                Log.Information ("options.Cookie.SecurePolicy: {0}", options.Cookie.SecurePolicy);


                        });
                        /*
                        .AddOAuth("SAMS", options =>
                        {
                            options.ClientId = Configuration["sams:client_id"];
                            options.ClientSecret = Configuration["sams:client_secret"];
                            options.CallbackPath = new PathString("/Account/SignInCallback");//new PathString(Configuration["sams:callback_url"]);// new PathString("/signin-github");

                            options.AuthorizationEndpoint = Configuration["sams:endpoint_authorization"];// "https://github.com/login/oauth/authorize";
                            options.TokenEndpoint = Configuration["sams:endpoint_token"];// ""https://github.com/login/oauth/access_token";
                            options.UserInformationEndpoint = Configuration["sams:endpoint_user_info"];// "https://api.github.com/user";

                            options.SaveTokens = true;

                            options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                            options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                            options.ClaimActions.MapJsonKey("urn:github:login", "login");
                            options.ClaimActions.MapJsonKey("urn:github:url", "html_url");
                            options.ClaimActions.MapJsonKey("urn:github:avatar", "avatar_url");

                            options.Events = new OAuthEvents
                            {
                                OnCreatingTicket = async context =>
                                {
                                    var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

                                    var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                                    response.EnsureSuccessStatusCode();

                                    var user = JObject.Parse(await response.Content.ReadAsStringAsync());

                                    context.RunClaimActions(user);
                                }
                            };
                    }); */
                        
                }
                else
                {
                    Log.Information ("using sams and NOT is_development");

                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/SignIn");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.Strict;
                                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                               options.Events = get_sams_authentication_events();

                                Log.Information ("options.Cookie.SameSite: {0}", options.Cookie.SameSite);
                                Log.Information ("options.Cookie.SecurePolicy: {0}", options.Cookie.SecurePolicy);


                        });
                        /*
                        .AddOAuth("SAMS", options =>
                        {
                            options.ClientId = Configuration["sams:client_id"];
                            options.ClientSecret = Configuration["sams:client_secret"];
                            options.CallbackPath = Configuration["sams:callback_url"];// new PathString("/signin-github");

                            options.AuthorizationEndpoint = Configuration["sams:endpoint_authorization"];// "https://github.com/login/oauth/authorize";
                            options.TokenEndpoint = Configuration["sams:endpoint_token"];// ""https://github.com/login/oauth/access_token";
                            options.UserInformationEndpoint = Configuration["sams:endpoint_user_info"];// "https://api.github.com/user";

                            options.SaveTokens = true;

                            options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                            options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                            options.ClaimActions.MapJsonKey("urn:github:login", "login");
                            options.ClaimActions.MapJsonKey("urn:github:url", "html_url");
                            options.ClaimActions.MapJsonKey("urn:github:avatar", "avatar_url");

                            options.Events = new OAuthEvents
                            {
                                OnCreatingTicket = async context =>
                                {
                                    var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

                                    var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                                    response.EnsureSuccessStatusCode();

                                    var user = JObject.Parse(await response.Content.ReadAsStringAsync());

                                    context.RunClaimActions(user);
                                }
                            };
                    }); */
                }
                
            }
            else
            {
                Log.Information ("NOT using sams");

                if(Configuration["mmria_settings:is_development"]!= null && Configuration["mmria_settings:is_development"] == "true")
                {
                    Log.Information ("is_development == true");
                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/Login/");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.None;
                                //options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

                                Log.Information ("options.Cookie.SameSite: {0}", options.Cookie.SameSite);
                                Log.Information ("options.Cookie.SecurePolicy: {0}", options.Cookie.SecurePolicy);
                        });
                }
                else
                {
                    Log.Information ("is_development == false");

                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/Login/");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.Strict;
                                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                               // options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                               Log.Information ("options.Cookie.SameSite: {0}", options.Cookie.SameSite);
                                Log.Information ("options.Cookie.SecurePolicy: {0}", options.Cookie.SecurePolicy);
                        });
                }
            }
            


            services.AddAuthorization(options =>
            {
                //options.AddPolicy("AdministratorOnly", policy => policy.RequireRole("Administrator"));
                options.AddPolicy("abstractor", policy => policy.RequireRole("abstractor"));
                options.AddPolicy("form_designer", policy => policy.RequireRole("form_designer"));
                options.AddPolicy("committee_member", policy => policy.RequireRole("committee_member"));
                options.AddPolicy("jurisdiction_admin", policy => policy.RequireRole("jurisdiction_admin"));
                options.AddPolicy("installation_admin", policy => policy.RequireRole("installation_admin"));
                options.AddPolicy("guest", policy => policy.RequireRole("guest"));

                //options.AddPolicy("form_designer", policy => policy.RequireClaim("EmployeeId"));
                //options.AddPolicy("EmployeeId", policy => policy.RequireClaim("EmployeeId", "123", "456"));
                //options.AddPolicy("Over21Only", policy => policy.Requirements.Add(new MinimumAgeRequirement(21)));
                //options.AddPolicy("BuildingEntry", policy => policy.Requirements.Add(new OfficeEntryRequirement()));
                
            });            

            services.AddMvc(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                                .RequireAuthenticatedUser()
                                .Build();
                config.Filters.Add(new AuthorizeFilter(policy));

                config.CacheProfiles.Add("NoStore",
                new Microsoft.AspNetCore.Mvc.CacheProfile()
                {
                    NoStore = true
                });
            });

            //https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger?tabs=netcore-cli
            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "My API", Version = "v1" });
            });


            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            this.Start();

            
            
        }

        
        private CookieAuthenticationEvents get_sams_authentication_events()
        {
            //https://stackoverflow.com/questions/52175302/handling-expired-refresh-tokens-in-asp-net-core

            var sams_endpoint_authorization = Configuration["sams:endpoint_authorization"];
            var sams_endpoint_token = Configuration["sams:endpoint_token"];
            var sams_endpoint_user_info = Configuration["sams:endpoint_user_info"];
            var sams_endpoint_token_validation = Configuration["sams:token_validation"];
            var sams_endpoint_user_info_sys = Configuration["sams:user_info_sys"];
            var sams_client_id = Configuration["sams:client_id"];
            var sams_client_secret = Configuration["sams:client_secret"];
            var sams_callback_url = Configuration["sams:callback_url"]; 

            var result = new CookieAuthenticationEvents
            {
                OnValidatePrincipal = context =>
                {
                    //check to see if user is authenticated first
                    if (context.Principal.Identity.IsAuthenticated)
                    {

                        
                        var expires_at = context.Request.Cookies["expires_at"];

                        var expires_at_time = DateTimeOffset.Parse(expires_at);
                        
/*
                        var accessToken = context.Request.HttpContext.Session.GetString("access_token");
                        var refreshToken = context.Request.HttpContext.Session.GetString("refresh_token");
                        var exp = context.Request.HttpContext.Session.GetInt32("expires_in");
 */

            /*
                        var tokens = context.Properties.GetTokens();
                        var refreshToken = tokens.FirstOrDefault(t => t.Name == "refresh_token");
                        var accessToken = tokens.FirstOrDefault(t => t.Name == "access_token");
                        var exp = tokens.FirstOrDefault(t => t.Name == "expires_at");
                        var expires = DateTime.Parse(exp.Value);
                         */

                        //context.Request.Cookies.["sid"].
                       // var expires = DateTime.Parse(exp.ToString());
                        //check to see if the token has expired
                        if (expires_at_time.DateTime < DateTime.Now)
                        {
                            try 
                            {
                                var sid = context.Request.Cookies["sid"];

                                string request_string = Program.config_couchdb_url + $"/session/{sid}";
                                var curl = new cURL ("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                                string session_json = curl.execute();
                                var session = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.session> (session_json);

                                var userName = context.Principal.Identities.First(
                                        u => u.IsAuthenticated && 
                                        u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;


                                if(!userName.Equals(session.user_id, StringComparison.OrdinalIgnoreCase))
                                {
                                    context.RejectPrincipal();
                                    return Task.CompletedTask;
                                }

                                var accessToken = session.data["access_token"];
                                var refreshToken = session.data["refresh_token"];
                                var exp = session.data["expires_at"];
                                expires_at_time = DateTimeOffset.Parse(exp);
                                
                                // server-side check for expiration
                                if (expires_at_time.DateTime < DateTime.Now)
                                {
                                    //token is expired, let's attempt to renew
                                    var tokenEndpoint = sams_endpoint_token;
                                    var tokenClient = new mmria.server.util.TokenClient(Configuration);

                                    //var name = HttpContext.Session.GetString(SessionKeyName);
                                    //var name = HttpContext.Session.GetString(SessionKeyName);

                                    var tokenResponse = tokenClient.get_refresh_token(accessToken.ToString(), refreshToken.ToString()).Result;
                                    //check for error while renewing - any error will trigger a new login.
                                    if (tokenResponse.is_error)
                                    {
                                        //reject Principal
                                        context.RejectPrincipal();
                                        return Task.CompletedTask;
                                    }
                                    //set new token values
                                    refreshToken = tokenResponse.refresh_token;
                                    accessToken = tokenResponse.access_token;
                                    var unix_time = DateTimeOffset.UtcNow.AddSeconds(tokenResponse.expires_in);

                                    session.data["access_token"] = accessToken;
                                    session.data["refresh_token"] = refreshToken;
                                    session.data["expires_at"] = unix_time.ToString();

                                    context.Response.Cookies.Append("expires_at", unix_time.ToString(), new CookieOptions{ HttpOnly = true });


                                    session.date_last_updated  = DateTime.UtcNow;


                                    var Session_Message = new mmria.server.model.actor.Session_Message
                                    (
                                        session._id, //_id = 
                                        session._rev, //_rev = 
                                        session.date_created, //date_created = 
                                        session.date_last_updated, //date_last_updated = 
                                        session.date_expired, //date_expired = 

                                        session.is_active, //is_active = 
                                        session.user_id, //user_id = 
                                        session.ip, //ip = 
                                        session.session_event_id, // session_event_id = 
                                        session.data
                                    );

                                    Program.actorSystem.ActorOf(Props.Create<mmria.server.model.actor.Post_Session>()).Tell(Session_Message);
    
                                    //trigger context to renew cookie with new token values
                                    context.ShouldRenew = true;
                                    return Task.CompletedTask;
                                }

                            } 
                            catch (Exception ex) 
                            {
                                // do nothing for now document doesn't exsist.
                                System.Console.WriteLine ($"err caseController.Post\n{ex}");
                            }
                        }
                    }
                    return Task.CompletedTask;
                }
            };

            return result;
        }
        
        

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.Use
            (
                async (context, next) =>
                {

                    if
                    (
                        context.Request.Headers.ContainsKey("X-HTTP-METHOD") ||
                        context.Request.Headers.ContainsKey("X-HTTP-Method-Override") ||
                        context.Request.Headers.ContainsKey("X-METHOD-OVERRIDE")
                    )
                    {
                        context.Response.Headers.Add("X-Frame-Options", "DENY");
                        context.Response.Headers.Add("Content-Security-Policy",  
                        "" +  
                        "frame-ancestors  'none'"); 
                        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                        context.Response.Headers.Add("Cache-Control","no-cache, no-store"); 
                        context.Response.Headers.Add("X-XSS-Protection","1; mode=block"); 
                        context.Response.StatusCode = 405;

                    }
                    else
                    {
                        context.Response.Headers.Add("X-Frame-Options", "DENY");
                        context.Response.Headers.Add("Content-Security-Policy",  
                        "" +  
                        "frame-ancestors  'none'"); 
                        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                        context.Response.Headers.Add("Cache-Control","no-cache, no-store"); 
                        context.Response.Headers.Add("X-XSS-Protection","1; mode=block"); 

                        await next();
                    }
                }
            );
            app.UseAuthentication();


            //app.UseMvc();
            //app.UseSession();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            //app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();

                        //http://localhost:5000/swagger/v1/swagger.json
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

        }

        public void Start()
		{
            if(Program.is_schedule_enabled)
            {
                System.Threading.Tasks.Task.Run
                (
                    new Action (async () => 
                    {
                        await new mmria.server.util.c_db_setup(Program.actorSystem).Setup();
                    }
                    
                ));
            }
			else
            {
                /*
                System.Threading.Tasks.Task.Run
                (
                    new Action (async () => 
                    {
                        await new mmria.server.util.c_db_setup(Program.actorSystem).Install_Check();
                    }
                    
                ));
                 */
            }

            // ****   Quartz Timer - End
		}
    }

    public class MethodOverrideHandler : DelegatingHandler
{
    readonly string[] _methods = { "DELETE", "HEAD", "PUT" };
    const string _header = "X-HTTP-Method-Override";
 
    protected override Task<HttpResponseMessage> SendAsync
    (
        HttpRequestMessage request,
        System.Threading.CancellationToken cancellationToken
    )
    {
        // Check for HTTP POST with the X-HTTP-Method-Override header.
        if (request.Method == HttpMethod.Post && request.Headers.Contains(_header))
        {
            // Check if the header value is in our methods list.
            var method = request.Headers.GetValues(_header).FirstOrDefault();
            if (_methods.Contains(method, StringComparer.InvariantCultureIgnoreCase))
            {
                // Change the request method.
                request.Method = new HttpMethod(method);
            }
        }
        return base.SendAsync(request, cancellationToken);
    }
}
}
