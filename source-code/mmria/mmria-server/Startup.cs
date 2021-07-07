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
//using Swashbuckle.AspNetCore.Swagger;
using Quartz;
using Quartz.Impl;
using Serilog;
using Serilog.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using mmria.server.authentication;


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
      Program.DateOfLastChange_Sequence_Call = new List<DateTime>();
      Program.Change_Sequence_Call_Count++;
      Program.DateOfLastChange_Sequence_Call.Add(DateTime.Now);

      Program.config_geocode_api_key = "";
      Program.config_geocode_api_url = "";

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:is_schedule_enabled"]))
      {
        bool.TryParse(Configuration["mmria_settings:is_schedule_enabled"], out Program.is_schedule_enabled);
      }

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:is_db_check_enabled"]))
      {
        bool.TryParse(Configuration["mmria_settings:is_db_check_enabled"], out Program.is_db_check_enabled);
      }


      if (!string.IsNullOrEmpty(Configuration["mmria_settings:app_instance_name"]))
      {
        Program.app_instance_name = Configuration["mmria_settings:app_instance_name"];
      }

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:metadata_version"]))
      {
        Program.metadata_release_version_name = Configuration["mmria_settings:metadata_version"];
      }


      if (!string.IsNullOrEmpty(Configuration["mmria_settings:power_bi_link"]))
      {
        Program.power_bi_link = Configuration["mmria_settings:power_bi_link"];
      }

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:power_bi_aggregate"]))
      {
        Program.power_bi_aggregate = Configuration["mmria_settings:power_bi_aggregate"];
      }

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:db_prefix"]))
      {
        Program.db_prefix = Configuration["mmria_settings:db_prefix"];
      }

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:cdc_instance_pull_list"]))
      {
        Program.config_cdc_instance_pull_list = Configuration["mmria_settings:cdc_instance_pull_list"];
      }

      if (!string.IsNullOrEmpty(Configuration["mmria_settings:cdc_instance_pull_db_url"]))
      {
        Program.config_cdc_instance_pull_db_url = Configuration["mmria_settings:cdc_instance_pull_db_url"];
      }

        if (!string.IsNullOrEmpty(Configuration["mmria_settings:vitals_url"]))
        {
            Program.config_vitals_url = Configuration["mmria_settings:vitals_url"];
        }

        if (!string.IsNullOrEmpty(Configuration["mmria_settings:vitals_service_key"]))
        {
            Program.vitals_service_key = Configuration["mmria_settings:vitals_service_key"];
        }


        if (!string.IsNullOrEmpty(Configuration["mmria_settings:config_id"]))
        {
            Program.config_id = Configuration["mmria_settings:config_id"];
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

      Program.config_session_idle_timeout_minutes = Configuration["mmria_settings:session_idle_timeout_minutes"] != null && int.TryParse(Configuration["mmria_settings:session_idle_timeout_minutes"], out test_int) ? test_int : 30;


      Program.config_pass_word_minimum_length = string.IsNullOrWhiteSpace(Configuration["password_settings:minimum_length"]) ? 8 : int.Parse(Configuration["password_settings:minimum_length"]);
      Program.config_pass_word_days_before_expires = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_expires"]) ? 0 : int.Parse(Configuration["password_settings:days_before_expires"]);
      Program.config_pass_word_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(Configuration["password_settings:days_before_user_is_notified_of_expiration"]) ? 0 : int.Parse(Configuration["password_settings:days_before_user_is_notified_of_expiration"]);

      Program.config_default_days_in_effective_date_interval = string.IsNullOrWhiteSpace(Configuration["authentication_settings:default_days_in_effective_date_interval"]) ? 0 : int.Parse(Configuration["authentication_settings:default_days_in_effective_date_interval"]);
      Program.config_unsuccessful_login_attempts_number_before_lockout = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"]) ? 5 : int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"]);
      Program.config_unsuccessful_login_attempts_within_number_of_minutes = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"]) ? 120 : int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"]);
      Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = string.IsNullOrWhiteSpace(Configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]) ? 15 : int.Parse(Configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]);



      if (bool.Parse(Configuration["mmria_settings:is_environment_based"]))
      {
        Log.Information("using Environment");


        //Log.Information ("geocode_api_key: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_key"));
        //Log.Information ("geocode_api_url: {0}", System.Environment.GetEnvironmentVariable ("geocode_api_url"));
        Log.Information("couchdb_url: {0}", System.Environment.GetEnvironmentVariable("couchdb_url"));
        Log.Information("web_site_url: {0}", System.Environment.GetEnvironmentVariable("web_site_url"));
        Log.Information("export_directory: {0}", System.Environment.GetEnvironmentVariable("export_directory"));

        //Program.config_geocode_api_key = System.Environment.GetEnvironmentVariable ("geocode_api_key");
        //Program.config_geocode_api_url = System.Environment.GetEnvironmentVariable ("geocode_api_url");
        Program.config_couchdb_url = System.Environment.GetEnvironmentVariable("couchdb_url");
        Program.config_web_site_url = System.Environment.GetEnvironmentVariable("web_site_url");
        //Program.config_file_root_folder = System.Environment.GetEnvironmentVariable ("file_root_folder");
        Program.config_timer_user_name = System.Environment.GetEnvironmentVariable("timer_user_name");
        Program.config_timer_value = System.Environment.GetEnvironmentVariable("timer_password");
        Program.config_cron_schedule = System.Environment.GetEnvironmentVariable("cron_schedule");
        Program.config_export_directory = System.Environment.GetEnvironmentVariable("export_directory") != null ? System.Environment.GetEnvironmentVariable("export_directory") : "/workspace/export";

        Configuration["mmria_settings:couchdb_url"]  = Program.config_couchdb_url;
        Configuration["mmria_settings:web_site_url"] = Program.config_web_site_url;

        Configuration["mmria_settings:timer_user_name"] = Program.config_timer_user_name;
        Configuration["mmria_settings:timer_password"] = Program.config_timer_value;
        Configuration["mmria_settings:cron_schedule"] = Program.config_cron_schedule;



        Configuration["mmria_settings:export_directory"] = Program.config_export_directory;

        Program.config_session_idle_timeout_minutes = System.Environment.GetEnvironmentVariable("session_idle_timeout_minutes") != null && int.TryParse(System.Environment.GetEnvironmentVariable("session_idle_timeout_minutes"), out test_int) ? test_int : 30;
        Configuration["mmria_settings:session_idle_timeout_minutes"] = Program.config_session_idle_timeout_minutes.ToString();


        Program.config_pass_word_minimum_length = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("password_minimum_length")) ? 8 : int.Parse(System.Environment.GetEnvironmentVariable("password_minimum_length"));
        Program.config_pass_word_days_before_expires = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("password_days_before_expires")) ? 0 : int.Parse(System.Environment.GetEnvironmentVariable("password_days_before_expires"));
        Program.config_pass_word_days_before_user_is_notified_of_expiration = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("password_days_before_user_is_notified_of_expiration")) ? 0 : int.Parse(System.Environment.GetEnvironmentVariable("password_days_before_user_is_notified_of_expiration"));

       
        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("vitals_url")))
        {
            Configuration["mmria_settings:vitals_url"] = System.Environment.GetEnvironmentVariable("vitals_url");
            Program.config_vitals_url = System.Environment.GetEnvironmentVariable("vitals_url");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_authorization")))
        {
          Configuration["sams:endpoint_authorization"] = System.Environment.GetEnvironmentVariable("sams_endpoint_authorization");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("use_development_settings")))
        {
          Configuration["mmria_settings:is_development"] = System.Environment.GetEnvironmentVariable("use_development_settings");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("metadata_version")))
        {
          Configuration["mmria_settings:metadata_version"] = System.Environment.GetEnvironmentVariable("metadata_version");
          Program.metadata_release_version_name = System.Environment.GetEnvironmentVariable("metadata_version");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_token")))
        {
          Configuration["sams:endpoint_token"] = System.Environment.GetEnvironmentVariable("sams_endpoint_token");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_user_info")))
        {
          Configuration["sams:endpoint_user_info"] = System.Environment.GetEnvironmentVariable("sams_endpoint_user_info");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_token_validation")))
        {
          Configuration["sams:token_validation"] = System.Environment.GetEnvironmentVariable("sams_endpoint_token_validation");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_endpoint_user_info_sys")))
        {
          Configuration["sams:user_info_sys"] = System.Environment.GetEnvironmentVariable("sams_endpoint_user_info_sys");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_client_id")))
        {
          Configuration["sams:client_id"] = System.Environment.GetEnvironmentVariable("sams_client_id");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_client_secret")))
        {
          Configuration["sams:client_secret"] = System.Environment.GetEnvironmentVariable("sams_client_secret");
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_callback_url")))
        {
          Configuration["sams:callback_url"] = System.Environment.GetEnvironmentVariable("sams_callback_url");
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_logout_url")))
        {
          Configuration["sams:logout_url"] = System.Environment.GetEnvironmentVariable("sams_logout_url");
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("sams_is_enabled")))
        {
          Configuration["sams:is_enabled"] = System.Environment.GetEnvironmentVariable("sams_is_enabled");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("is_schedule_enabled")) && bool.TryParse(System.Environment.GetEnvironmentVariable("is_schedule_enabled"), out Program.is_schedule_enabled))
        {
          Configuration["is_schedule_enabled"] = System.Environment.GetEnvironmentVariable("is_schedule_enabled");
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("is_db_check_enabled")) && bool.TryParse(System.Environment.GetEnvironmentVariable("is_db_check_enabled"), out Program.is_db_check_enabled))
        {
          Configuration["is_db_check_enabled"] = System.Environment.GetEnvironmentVariable("is_db_check_enabled");
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("app_instance_name")))
        {
          Configuration["mmria_settings:app_instance_name"] = System.Environment.GetEnvironmentVariable("app_instance_name");
          Program.app_instance_name = Configuration["mmria_settings:app_instance_name"];
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("power_bi_link")))
        {
          Configuration["mmria_settings:power_bi_link"] = System.Environment.GetEnvironmentVariable("power_bi_link");
          Program.power_bi_link = Configuration["mmria_settings:power_bi_link"];
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("power_bi_aggregate")))
        {
          Configuration["mmria_settings:power_bi_aggregate"] = System.Environment.GetEnvironmentVariable("power_bi_aggregate");
          Program.power_bi_aggregate = Configuration["mmria_settings:power_bi_aggregate"];
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("db_prefix")))
        {
          Configuration["mmria_settings:db_prefix"] = System.Environment.GetEnvironmentVariable("db_prefix");
          Program.db_prefix = Configuration["mmria_settings:db_prefix"];
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("cdc_instance_pull_list")))
        {
          Configuration["mmria_settings:cdc_instance_pull_list"] = System.Environment.GetEnvironmentVariable("cdc_instance_pull_list");
          Program.config_cdc_instance_pull_list = Configuration["mmria_settings:cdc_instance_pull_list"];
        }


        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("cdc_instance_pull_db_url")))
        {
          Configuration["mmria_settings:cdc_instance_pull_db_url"] = System.Environment.GetEnvironmentVariable("cdc_instance_pull_db_url");
          Program.config_cdc_instance_pull_db_url = Configuration["mmria_settings:cdc_instance_pull_db_url"];
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("vitals_service_key")))
        {
          Configuration["mmria_settings:vitals_service_key"] = System.Environment.GetEnvironmentVariable("vitals_service_key");
          Program.vitals_service_key = Configuration["mmria_settings:vitals_service_key"];
        }

        if (!string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("config_id")))
        {
          Configuration["mmria_settings:config_id"] = System.Environment.GetEnvironmentVariable("config_id");
          Program.config_id = Configuration["mmria_settings:config_id"];
        }

        Program.config_default_days_in_effective_date_interval = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("default_days_in_effective_date_interval")) ? 90 : int.Parse(System.Environment.GetEnvironmentVariable("default_days_in_effective_date_interval"));
        Program.config_unsuccessful_login_attempts_number_before_lockout = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_number_before_lockout")) ? 5 : int.Parse(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_number_before_lockout"));
        Program.config_unsuccessful_login_attempts_within_number_of_minutes = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_within_number_of_minutes")) ? 120 : int.Parse(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_within_number_of_minutes"));
        Program.config_unsuccessful_login_attempts_lockout_number_of_minutes = string.IsNullOrWhiteSpace(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_lockout_number_of_minutes")) ? 15 : int.Parse(System.Environment.GetEnvironmentVariable("unsuccessful_login_attempts_lockout_number_of_minutes"));

      }



      Log.Information($"Program.config_timer_user_name = {Program.config_timer_user_name}");
      Log.Information($"Program.config_couchdb_url = {Program.config_couchdb_url}");
      Log.Information($"Program.db_prefix = {Program.db_prefix}");
      Log.Information($"Logging = {Configuration["Logging:IncludeScopes"]}");
      Log.Information($"Console = {Configuration["Console:LogLevel:Default"]}");
      Log.Information("sams:callback_url: {0}", Configuration["sams:callback_url"]);
      Log.Information("sams:activity_name: {0}", Configuration["sams:activity_name"]);
      Log.Information("mmria_settings:is_schedule_enabled: {0}", Configuration["mmria_settings:is_schedule_enabled"]);
      Log.Information("mmria_settings:is_db_check_enabled: {0}", Configuration["mmria_settings:is_db_check_enabled"]);
      Log.Information("mmria_settings:is_development: {0}", Configuration["mmria_settings:is_development"]);
      Log.Information("mmria_settings:metadata_version: {0}", Configuration["mmria_settings:metadata_version"]);
      Log.Information("mmria_settings:power_bi_link: {0}", Configuration["mmria_settings:power_bi_link"]);
      Log.Information("mmria_settings:app_instance_name: {0}", Configuration["mmria_settings:app_instance_name"]);
      Log.Information("mmria_settings:session_idle_timeout_minutes: {0}", Configuration["mmria_settings:session_idle_timeout_minutes"]);
      Log.Information("Program.config_session_idle_timeout_minutes: {0}", Program.config_session_idle_timeout_minutes);

      if(!string.IsNullOrWhiteSpace(Program.vitals_service_key))
      {
          Log.Information("Program.config_vitals_service_key is present");
      }


        var DbConfigSet = GetConfiguration();
        services.AddSingleton<mmria.common.couchdb.ConfigurationSet>(DbConfigSet);

        Program.configuration_set = DbConfigSet;
                   

      Program.actorSystem = ActorSystem.Create("mmria-actor-system");
      services.AddSingleton(typeof(ActorSystem), (serviceProvider) => Program.actorSystem);

      ISchedulerFactory schedFact = new StdSchedulerFactory();
      Quartz.IScheduler sched = schedFact.GetScheduler().Result;

      // compute a time that is on the next round minute
      DateTimeOffset runTime = DateBuilder.EvenMinuteDate(DateTimeOffset.UtcNow);

      // define the job and tie it to our HelloJob class
      IJobDetail job = JobBuilder.Create<mmria.server.model.Pulse_job>()
          .WithIdentity("job1", "group1")
          .Build();

      // Trigger the job to run on the next round minute
      ITrigger trigger = TriggerBuilder.Create()
          .WithIdentity("trigger1", "group1")
          .StartAt(runTime.AddMinutes(3))
          .WithCronSchedule(Program.config_cron_schedule)
          .Build();

      sched.ScheduleJob(job, trigger);

      if (Program.is_schedule_enabled)
      {
        sched.Start();
      }

      var quartzSupervisor = Program.actorSystem.ActorOf(Props.Create<mmria.server.model.actor.QuartzSupervisor>(), "QuartzSupervisor");

      quartzSupervisor.Tell("init");

      var use_sams = false;

      if (!string.IsNullOrWhiteSpace(Configuration["sams:is_enabled"]))
      {
        bool.TryParse(Configuration["sams:is_enabled"], out use_sams);
      }

      if (use_sams)
      {
        Log.Information("using sams");


        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = CustomAuthOptions.DefaultScheme;
            options.DefaultChallengeScheme = CustomAuthOptions.DefaultScheme;
        })
        .AddCustomAuth(options =>
        {
            // Configure single or multiple passwords for authentication
            options.AuthKey = "custom auth key";
            options.Is_SAMS = true;
        });


      }
      else
      {
        Log.Information("NOT using sams");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = CustomAuthOptions.DefaultScheme;
            options.DefaultChallengeScheme = CustomAuthOptions.DefaultScheme;
        })
        .AddCustomAuth(options =>
        {
            // Configure single or multiple passwords for authentication
            options.AuthKey = "custom auth key";
            options.Is_SAMS = false;
        });
      }



      services.AddAuthorization(options =>
      {
        //options.AddPolicy("AdministratorOnly", policy => policy.RequireRole("Administrator"));
        options.AddPolicy("abstractor", policy => policy.RequireRole("abstractor"));
        options.AddPolicy("data_analyst", policy => policy.RequireRole("data_analyst"));
        options.AddPolicy("form_designer", policy => policy.RequireRole("form_designer"));
        options.AddPolicy("committee_member", policy => policy.RequireRole("committee_member"));
        options.AddPolicy("jurisdiction_admin", policy => policy.RequireRole("jurisdiction_admin"));
        options.AddPolicy("installation_admin", policy => policy.RequireRole("installation_admin"));
        options.AddPolicy("guest", policy => policy.RequireRole("guest"));

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
      /*.AddJsonOptions(o =>
          {
              o.JsonSerializerOptions.PropertyNamingPolicy = null;
              o.JsonSerializerOptions.DictionaryKeyPolicy = null;
          });
*/
      services.AddControllers().AddNewtonsoftJson();



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

                string request_string = Program.config_couchdb_url + $"/{Program.db_prefix}session/{sid}";
                var curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string session_json = curl.execute();
                var session = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.actor.Session_MessageDTO>(session_json);

                var userName = context.Principal.Identities.First(
                                u => u.IsAuthenticated &&
                                u.HasClaim(c => c.Type == ClaimTypes.Name)).FindFirst(ClaimTypes.Name).Value;


                if (!userName.Equals(session.user_id, StringComparison.OrdinalIgnoreCase))
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
                  var tokenClient = new mmria.server.utilsTokenClient(Configuration);

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

                  context.Response.Cookies.Append("expires_at", unix_time.ToString(), new CookieOptions { HttpOnly = true });


                  session.date_last_updated = DateTime.UtcNow;


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
                              session.role_list,
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
                System.Console.WriteLine($"err caseController.Post\n{ex}");
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
            switch (context.Request.Method.ToLower())
            {

              case "get":
              case "put":
              case "post":
              case "head":
              case "delete":

                if
                      (
                          (context.Request.Headers.ContainsKey("Content-Length") &&
                          context.Request.Headers["Content-Length"].Count > 1) ||
                          (context.Request.Headers.ContainsKey("Transfer-Encoding") &&
                          context.Request.Headers["Transfer-Encoding"].Count > 1)
                      )
                {
                  context.Response.StatusCode = 400;
                  context.Response.Headers.Add("Connection", "close");
                  //context.Abort();
                  //context.RequestAborted.Session
                }
                else if
                      (

                          context.Request.Headers.ContainsKey("Content-Length") &&
                          context.Request.Headers.ContainsKey("Transfer-Encoding")
                      )
                {
                  context.Response.StatusCode = 400;
                  context.Response.Headers.Add("Connection", "close");
                  // context.Abort();
                }
                else if
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
                  context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                  context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
                  context.Response.Headers.Add("Connection", "close");
                  context.Response.StatusCode = 400;
                  //context.Abort();

                }
                else
                {
                  context.Response.Headers.Add("X-Frame-Options", "DENY");
                  context.Response.Headers.Add("Content-Security-Policy",
                        "" +
                        "frame-ancestors  'none'");
                  context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                  context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                  context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

                  await next();
                }

                break;
              default:
                context.Response.StatusCode = 400;
                context.Response.Headers.Add("Connection", "close");
                //context.Abort();
                break;
            }
          }
      );


      var use_sams = false;

      if (!string.IsNullOrWhiteSpace(Configuration["sams:is_enabled"]))
      {
        bool.TryParse(Configuration["sams:is_enabled"], out use_sams);
      }

      app.UseDefaultFiles();

    app.UseStaticFiles();


      app.UseRouting();
      app.UseAuthentication();
      app.UseAuthorization();
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}");
      });

    
    }

    public void Start()
    {
      if (Program.is_schedule_enabled)
      {
        System.Threading.Tasks.Task.Run
        (
            new Action(async () =>
           {
             await new mmria.server.utilsc_db_setup(Program.actorSystem).Setup();
           }

        ));
      }
      else
      {

      }

      
    }

    private static mmria.common.couchdb.ConfigurationSet GetConfiguration()
    {
        var result = new mmria.common.couchdb.ConfigurationSet();
        try
        {
            string request_string = $"{Program.config_couchdb_url}/configuration/{Program.config_id}";
            var case_curl = new mmria.server.cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = case_curl.execute();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.couchdb.ConfigurationSet> (responseFromServer);

        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return result;
    }
  }

}
