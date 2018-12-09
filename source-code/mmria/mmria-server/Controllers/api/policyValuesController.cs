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
    //[AllowAnonymous] 
    [Route("api/[controller]")]
    public class policyValuesController : Controller
    {
        IConfiguration configuration;
        public policyValuesController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }

        [HttpGet]
        public IEnumerable<KeyValuePair<string,string>> Get()
        {
            var result = new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);

                result.Add("password_minimum_length", configuration["password_settings:minimum_length"]);
                result.Add("password_days_before_expires", configuration["password_settings:days_before_expires"]);
                result.Add("password_days_before_user_is_notified_of_expiration", configuration["password_settings:days_before_user_is_notified_of_expiration"]);
                result.Add("default_days_in_effective_date_interval", configuration["authentication_settings:default_days_in_effective_date_interval"]);
                result.Add("unsuccessful_login_attempts_number_before_lockout", configuration["authentication_settings:unsuccessful_login_attempts_number_before_lockout"]);
                result.Add("unsuccessful_login_attempts_within_number_of_minutes", configuration["authentication_settings:unsuccessful_login_attempts_within_number_of_minutes"]);
                result.Add("unsuccessful_login_attempts_lockout_number_of_minutes", configuration["authentication_settings:unsuccessful_login_attempts_lockout_number_of_minutes"]);
                result.Add("sams_is_enabled", configuration["sams:is_enabled"]);

            return result;
        }

    }
}
