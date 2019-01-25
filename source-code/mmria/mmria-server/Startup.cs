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
            //Program.config_file_root_folder = "wwwroot";       

/*
             Log.Information ("sams:client_id: {0}", Configuration["sams:client_id"]);
             Log.Information ("sams:client_secret: {0}", Configuration["sams:client_secret"]);
 */             
             Log.Information ("sams:callback_url: {0}", Configuration["sams:callback_url"]);
             Log.Information ("sams:activity_name: {0}", Configuration["sams:activity_name"]);

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
                Program.config_timer_password = System.Environment.GetEnvironmentVariable ("timer_password");
                Program.config_cron_schedule = System.Environment.GetEnvironmentVariable ("cron_schedule");
                Program.config_export_directory = System.Environment.GetEnvironmentVariable ("export_directory") != null ? System.Environment.GetEnvironmentVariable ("export_directory") : "/workspace/export";

                Program.config_session_idle_timeout_minutes = System.Environment.GetEnvironmentVariable ("session_idle_timeout") != null && int.TryParse(System.Environment.GetEnvironmentVariable ("session_idle_timeout"), out int test_int) ? test_int : 30;


                Program.config_password_minimum_length = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("password_minimum_length"))? 8: int.Parse(System.Environment.GetEnvironmentVariable ("password_minimum_length"));
                Program.config_password_days_before_expires = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("password_days_before_expires"))? 0: int.Parse(System.Environment.GetEnvironmentVariable ("password_days_before_expires"));
                Program.config_password_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable ("password_days_before_user_is_notified_of_expiration"))? 0: int.Parse(System.Environment.GetEnvironmentVariable ("password_days_before_user_is_notified_of_expiration"));

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
            else 
            {
                //Program.config_geocode_api_key = configuration["mmria_settings:geocode_api_key"];
                //Program.config_geocode_api_url = configuration["mmria_settings:geocode_api_url"];
                Program.config_couchdb_url = Configuration["mmria_settings:couchdb_url"];
                Program.config_web_site_url = Configuration["mmria_settings:web_site_url"];
                //Program.config_file_root_folder = configuration["mmria_settings:file_root_folder"];
                Program.config_timer_user_name = Configuration["mmria_settings:timer_user_name"];
                Program.config_timer_password = Configuration["mmria_settings:timer_password"];
                Program.config_cron_schedule = Configuration["mmria_settings:cron_schedule"];
                Program.config_export_directory = Configuration["mmria_settings:export_directory"];

                Program.config_session_idle_timeout_minutes = Configuration["mmria_settings:session_idle_timeout"] != null && int.TryParse(Configuration["mmria_settings:session_idle_timeout"], out int test_int) ? test_int : 30;


                Program.config_password_minimum_length = string.IsNullOrWhiteSpace(Configuration["password_settings:minimum_length"])? 8: int.Parse(Configuration["password_settings:minimum_length"]);
                Program.config_password_days_before_expires = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_expires"])? 0: int.Parse(Configuration["password_settings:days_before_expires"]);
                Program.config_password_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_user_is_notified_of_expiration"])? 0: int.Parse(Configuration["password_settings:days_before_user_is_notified_of_expiration"]);
                

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
 



            }


            Log.Information($"Program.config_timer_user_name = {Program.config_timer_user_name}");
            Log.Information($"Program.config_couchdb_url = {Program.config_couchdb_url}");
            Log.Information($"Logging = {Configuration["Logging:IncludeScopes"]}");
            Log.Information($"Console = {Configuration["Console:LogLevel:Default"]}");


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

            sched.Start();
 
            var quartzSupervisor = Program.actorSystem.ActorOf(Props.Create<mmria.server.model.actor.QuartzSupervisor>(), "QuartzSupervisor");
            quartzSupervisor.Tell("init");

            var use_sams = false;
            
            if(!string.IsNullOrWhiteSpace(Configuration["sams:is_enabled"]))
            {
                bool.TryParse(Configuration["sams:is_enabled"], out use_sams);
            }


            //https://docs.microsoft.com/en-us/aspnet/core/fundamentals/app-state?view=aspnetcore-2.2
            services.AddDistributedMemoryCache();
            services.AddSession(opts =>
            {
                opts.Cookie.HttpOnly = true;
                opts.Cookie.Name = ".mmria.session";
                opts.IdleTimeout = TimeSpan.FromMinutes(Program.config_session_idle_timeout_minutes);
            });

            if(use_sams)
            {
                if(Configuration["mmria_settings:is_development"]!= null && Configuration["mmria_settings:is_development"] == "true")
                {
                    //https://github.com/jerriepelser-blog/AspnetCoreGitHubAuth/blob/master/AspNetCoreGitHubAuth/

                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/SignIn");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.None;
                                //options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                                options.Events = get_sams_authentication_events();

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
                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/SignIn");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.None;
                               // options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                               options.Events = get_sams_authentication_events();

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
                if(Configuration["mmria_settings:is_development"]!= null && Configuration["mmria_settings:is_development"] == "true")
                {
                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/Login/");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.None;
                                //options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                        });
                }
                else
                {
                    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                        options => 
                        {
                                options.LoginPath = new PathString("/Account/Login/");
                                options.AccessDeniedPath = new PathString("/Account/Forbidden/");
                                options.Cookie.SameSite = SameSiteMode.None;
                               // options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
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
                        //get the users tokens
                        var tokens = context.Properties.GetTokens();
                        var refreshToken = tokens.FirstOrDefault(t => t.Name == "refresh_token");
                        var accessToken = tokens.FirstOrDefault(t => t.Name == "access_token");
                        var exp = tokens.FirstOrDefault(t => t.Name == "expires_at");
                        var expires = DateTime.Parse(exp.Value);
                        //check to see if the token has expired
                        if (expires < DateTime.Now)
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
                            refreshToken.Value = tokenResponse.refresh_token;
                            accessToken.Value = tokenResponse.access_token;
                            //set new expiration date
                            var newExpires = DateTime.UtcNow + TimeSpan.FromSeconds(tokenResponse.expires_in);
                            exp.Value = newExpires.ToString("o", System.Globalization.CultureInfo.InvariantCulture);
                            //set tokens in auth properties 
                            context.Properties.StoreTokens(tokens);
                            //trigger context to renew cookie with new token values
                            context.ShouldRenew = true;
                            return Task.CompletedTask;
                        }
                    }
                    return Task.CompletedTask;
                }
            };

            return result;
        }
        
        

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseAuthentication();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }




            //app.UseMvc();
            app.UseSession();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

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
			System.Threading.Tasks.Task.Run
			(
				new Action (async () => 
				{
                    await mmria.server.util.c_db_setup.Setup();
				}
				
			));

            // ****   Quartz Timer - End
		}

/*

        private bool Verify_Password (string p_target_server, string p_user_name, string p_password)
        {
            bool result = false;

            var curl = new cURL ("GET", null, p_target_server + "/mmrds/_design/auth", null, p_user_name, p_password);
            try
            {
                curl.execute ();
                /*
                HTTP/1.1 200 OK
                Cache-Control: must-revalidate
                Content-Type: application/json
                Date: Mon, 12 Aug 2013 01:27:41 GMT
                Server: CouchDB (Erlang/OTP)* /
                result = true;
            } 
            catch (Exception ex) 
            {
                Log.Information ($"failed Verify_Password check: {p_target_server}/mmrds/_design/auth\n{ex}");
            }


            return result;
        }
 */

    }
}
