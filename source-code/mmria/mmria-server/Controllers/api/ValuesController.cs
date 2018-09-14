using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace mmria.server
{
    [AllowAnonymous] 
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        IConfiguration configuration;
        public ValuesController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }

        [HttpGet]
        public IEnumerable<KeyValuePair<string,string>> Get()
        {
            var result = new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);

                result.Add("password_minimum_length", configuration["mmria_settings:password_minimum_length"]);
                result.Add("password_days_before_expires", configuration["mmria_settings:password_days_before_expires"]);
                result.Add("password_days_before_user_is_notified_of_expiration", configuration["mmria_settings:password_days_before_user_is_notified_of_expiration"]);
                result.Add("default_days_in_effective_date_interval", configuration["mmria_settings:default_days_in_effective_date_interval"]);
                result.Add("unsuccessful_login_attempts_number_before_lockout", configuration["mmria_settings:unsuccessful_login_attempts_number_before_lockout"]);
                result.Add("unsuccessful_login_attempts_with_number_of_minutes", configuration["mmria_settings:unsuccessful_login_attempts_with_number_of_minutes"]);
                result.Add("unsuccessful_login_attempts_lockout_number_of_minutes", configuration["mmria_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]);

            return result;
        }

    }
}
