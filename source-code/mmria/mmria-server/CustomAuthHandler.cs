using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Microsoft.Extensions.Configuration;

namespace mmria.server.authentication
{
    public class CustomAuthHandler : AuthenticationHandler<CustomAuthOptions>
    {
        private IConfiguration _configuration;

        public CustomAuthHandler(IConfiguration configuration, IOptionsMonitor<CustomAuthOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock) 
            : base(options, logger, encoder, clock)
        {
            _configuration = configuration;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Get Authorization header value
            if
            (
                Request.Cookies.ContainsKey("sid") && 
                !string.IsNullOrWhiteSpace(Request.Cookies["sid"])
            )
            {

                var config_couchdb_url = _configuration["mmria_settings:couchdb_url"];
                var config_timer_user_name = _configuration["mmria_settings:timer_user_name"];
                var config_timer_password = _configuration["mmria_settings:timer_password"];
                var config_db_prefix = _configuration["mmria_settings:db_prefix"];


                mmria.server.model.actor.Session_MessageDTO session_message = null;
                try
                {
                    string request_string = $"{config_couchdb_url}/{config_db_prefix}session/{Request.Cookies["sid"]}";
                    System.Console.WriteLine($"Connection Refused on method: Get url: {request_string}");
				
                    
                    var session_message_curl = new mmria.server.cURL("GET", null, request_string, null, config_timer_user_name, config_timer_password);
                    var responseFromServer =  session_message_curl.execute();

                    session_message = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.server.model.actor.Session_MessageDTO>(responseFromServer);

                }
                catch(System.Exception ex)
                {
                    System.Console.WriteLine (ex);

                } 


                if(session_message.date_expired == null || session_message.date_expired.HasValue == false)
                {
                    return Task.FromResult(AuthenticateResult.Fail("Invalid session. Expired"));
                }
                else if(session_message.date_expired.HasValue && session_message.date_expired.Value < System.DateTime.Now)
                {
                    return Task.FromResult(AuthenticateResult.Fail("Invalid session. Expired"));
                }
                else if
                (
                    !string.IsNullOrWhiteSpace(session_message.user_id)
                )
                {
                    mmria.common.model.couchdb.user user = null;

/*
                    try
                    {
                        string request_string = $"{config_couchdb_url}/_users/{System.Web.HttpUtility.HtmlEncode("org.couchdb.user:" + user_name.ToLower())}";
                        System.Console.WriteLine($"Connection Refused on method: Get url: {request_string}");
                        var user_curl = new mmria.server.cURL("GET", null, request_string, null, config_timer_user_name, config_timer_password);
                        var responseFromServer =  user_curl.execute();

                        user = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.user>(responseFromServer); 
                    }
                    catch(System.Exception ex)
                    {
                        System.Console.WriteLine (ex);
                    } */

                    const string Issuer = "https://contoso.com";
                    var claims = new List<Claim>();
                    claims.Add(new Claim(ClaimTypes.Name, session_message.user_id, ClaimValueTypes.String, Issuer));
    
                    foreach(var role in session_message.role_list)
                    {
                        if(role == "_admin")
                        {
                            claims.Add(new Claim(ClaimTypes.Role, "installation_admin", ClaimValueTypes.String, Issuer));
                        }
                    }

                    foreach(var role in mmria.server.util.authorization.get_current_user_role_jurisdiction_set_for(session_message.user_id).Select( jr => jr.role_name).Distinct())
                    {
                        claims.Add(new Claim(ClaimTypes.Role, role, ClaimValueTypes.String, Issuer));
                    }

                    var userIdentity = new ClaimsIdentity("SuperSecureLogin");
                    userIdentity.AddClaims(claims);
                    var userPrincipal = new ClaimsPrincipal(userIdentity);

                    var session_idle_timeout_minutes = 30;
                    
                    if(_configuration["mmria_settings:session_idle_timeout_minutes"] != null)
                    {
                        int.TryParse(_configuration["mmria_settings:session_idle_timeout_minutes"], out session_idle_timeout_minutes);
                    }

                    var ticket = new AuthenticationTicket(userPrincipal,"custom");

                    this.Context.User=userPrincipal;
                    System.Threading.Thread.CurrentPrincipal = userPrincipal;


                    return Task.FromResult(AuthenticateResult.Success(ticket));
                }
                else
                {
                    return Task.FromResult(AuthenticateResult.Fail("Invalid session."));
                }
            }
            else 
            {
                if (!Request.Headers.TryGetValue(HeaderNames.Authorization, out var authorization))
                {
                    return Task.FromResult(AuthenticateResult.Fail("Cannot read authorization header."));
                }

                // The auth key from Authorization header check against the configured ones
                if (authorization.Any(key => Options.AuthKey.All(ak => ak != key)))
                {
                    return Task.FromResult(AuthenticateResult.Fail("Invalid auth key."));
                }

                return Task.FromResult(AuthenticateResult.Fail("Invalid auth key."));
            }
        }

        protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            Response.Redirect("/Account/SignIn");
        }


    }
}