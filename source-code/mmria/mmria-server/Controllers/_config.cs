using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    
    [Authorize(Roles = "installation_admin")]
    public class _configController : Controller
    {

        private IConfiguration configuration { get; }
        
        public _configController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }

        public IActionResult Index()
        {
            var app_config = new mmria.server.model.app_config();

            app_config.is_environment_based = bool.Parse(configuration["mmria_settings:is_environment_based"]);
            app_config.web_site_url = configuration["mmria_settings:web_site_url"];
            app_config.log_directory = configuration["mmria_settings:log_directory"];
            app_config.export_directory = configuration["mmria_settings:export_directory"];
            app_config.couchdb_url = configuration["mmria_settings:couchdb_url"];
            app_config.timer_user_name = configuration["mmria_settings:timer_user_name"];
            app_config.timer_password = configuration["mmria_settings:timer_password"];
            app_config.cron_schedule = configuration["mmria_settings:cron_schedule"];
            app_config.password_minimum_length = int.Parse(configuration["mmria_settings:password_minimum_length"]);
            app_config.password_days_before_expires = int.Parse(configuration["mmria_settings:password_days_before_expires"]);
            app_config.password_days_before_user_is_notified_of_expiration = int.Parse(configuration["mmria_settings:password_days_before_user_is_notified_of_expiration"]);
            app_config.EMAIL_USE_AUTHENTICATION = bool.Parse(configuration["mmria_settings:EMAIL_USE_AUTHENTICATION"]);
            app_config.EMAIL_USE_SSL = bool.Parse(configuration["mmria_settings:EMAIL_USE_SSL"]);
            app_config.SMTP_HOST = configuration["mmria_settings:SMTP_HOST"];
            app_config.SMTP_PORT = int.Parse(configuration["mmria_settings:SMTP_PORT"]);
            app_config.EMAIL_FROM = configuration["mmria_settings:EMAIL_FROM"];
            app_config.EMAIL_PASSWORD = configuration["mmria_settings:EMAIL_PASSWORD"];

            return View();
        }

    }
}