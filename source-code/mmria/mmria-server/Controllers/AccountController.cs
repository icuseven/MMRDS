using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Akka.Actor;


//https://github.com/blowdart/AspNetAuthorizationWorkshop
//https://digitalmccullough.com/posts/aspnetcore-auth-system-demystified.html
//https://gitlab.com/free-time-programmer/tutorials/demystify-aspnetcore-auth/tree/master
//https://docs.microsoft.com/en-us/aspnet/core/mvc/views/layout?view=aspnetcore-2.1

namespace mmria.server.Controllers
{
    
    public partial class AccountController : Controller
    {

        private IHttpContextAccessor _accessor;
        private ActorSystem _actorSystem;



        //public IConfiguration Configuration { get; }
        //public AccountController(IConfiguration configuration)

        public AccountController(IHttpContextAccessor httpContextAccessor, ActorSystem actorSystem)
        {
            _accessor = httpContextAccessor;
            _actorSystem = actorSystem;
        }

        public List<ApplicationUser> Users => new List<ApplicationUser>() 
        {
            new ApplicationUser { UserName = "user1", Password = "password" },
            new ApplicationUser{ UserName = "user2", Password = "password" }
        };


        [AllowAnonymous] 
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            TempData["returnUrl"] = returnUrl;

            return View();
        }


/*
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Login(string returnUrl = null)
        {
            const string Issuer = "https://contoso.com";

            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Name, "user1", ClaimValueTypes.String, Issuer));
            claims.Add(new Claim(ClaimTypes.Role, "abstractor", ClaimValueTypes.String, Issuer));
            //claims.Add(new Claim("EmployeeId", string.Empty, ClaimValueTypes.String, Issuer));
            claims.Add(new Claim("EmployeeId", "123", ClaimValueTypes.String, Issuer));
            claims.Add(new Claim(ClaimTypes.DateOfBirth, "1970-06-08", ClaimValueTypes.Date));

            var userIdentity = new ClaimsIdentity("SuperSecureLogin");
            userIdentity.AddClaims(claims);
            var userPrincipal = new ClaimsPrincipal(userIdentity);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                userPrincipal,
                new AuthenticationProperties
                {
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(30),
                    IsPersistent = false,
                    AllowRefresh = false
                });

            return RedirectToLocal(returnUrl);
        } */

        [AllowAnonymous] 
        [HttpPost]
        public async Task<IActionResult> Login(ApplicationUser user, string returnUrl = null) 
        {
            const string badUserNameOrPasswordMessage = "Username or password is incorrect.";
            if(
                user == null ||
                string.IsNullOrWhiteSpace(user.UserName) ||
                string.IsNullOrWhiteSpace(user.Password)
            ) 
            {
                return BadRequest(badUserNameOrPasswordMessage);
            }

			try
			{


                var unsuccessful_login_attempts_number_before_lockout = Program.config_unsuccessful_login_attempts_number_before_lockout;
                var unsuccessful_login_attempts_within_number_of_minutes = Program.config_unsuccessful_login_attempts_within_number_of_minutes;
                var unsuccessful_login_attempts_lockout_number_of_minutes = Program.config_unsuccessful_login_attempts_lockout_number_of_minutes;


                var is_locked_out = false;
                var failed_login_count = 0;
                

                try
                {
                    //var session_event_request_url = $"{Program.config_couchdb_url}/session/_design/session_event_sortable/_view/by_date_created_user_id?startkey=[" + "{}" + $",\"{user.UserName}\"]&decending=true&limit={unsuccessful_login_attempts_number_before_lockout}";
                    var session_event_request_url = $"{Program.config_couchdb_url}/session/_design/session_event_sortable/_view/by_user_id?startkey=\"{user.UserName}\"&endkey=\"{user.UserName}\"";

                    var session_event_curl = new cURL("GET", null, session_event_request_url, null, Program.config_timer_user_name, Program.config_timer_password);
                    string response_from_server = await session_event_curl.executeAsync ();

                    //var session_event_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_object_key_header<mmria.common.model.couchdb.session_event>>(response_from_server);
                    var session_event_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.session_event>>(response_from_server);

                    DateTime first_item_date = DateTime.Now;
                    DateTime last_item_date = DateTime.Now;

                    var MaxRange = DateTime.Now.AddMinutes(-unsuccessful_login_attempts_within_number_of_minutes);
                    session_event_response.rows.Sort(new mmria.common.model.couchdb.Compare_Session_Event_By_DateCreated<mmria.common.model.couchdb.session_event>());

                    foreach(var session_event in session_event_response.rows.Where(row=> row.value.date_created >= MaxRange))
                    {
                        if(session_event.value.action_result == mmria.common.model.couchdb.session_event.session_event_action_enum.failed_login)
                        {
                            
                            failed_login_count++;
                            if(failed_login_count==1)
                            {
                                first_item_date = session_event.value.date_created;
                            }
                            
                            if(failed_login_count >= unsuccessful_login_attempts_number_before_lockout)
                            {
                                last_item_date= session_event.value.date_created;
                                var grace_period_date = first_item_date.AddMinutes(unsuccessful_login_attempts_lockout_number_of_minutes);
                                if(DateTime.Now < grace_period_date)
                                {
                                    is_locked_out = true;
                                    break;
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                }
                catch(Exception ex) 
                {
                    System.Console.WriteLine ($"{ex}");
                }


                if(!is_locked_out)
                {

                    string post_data = string.Format ("name={0}&password={1}", user.UserName, user.Password);
                    byte[] post_byte_array = System.Text.Encoding.ASCII.GetBytes(post_data);

                    string request_string = Program.config_couchdb_url + "/_session";
                    System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));
                    //request.UseDefaultCredentials = true;

                    request.PreAuthenticate = false;
                    //request.Credentials = new System.Net.NetworkCredential("mmrds", "mmrds");
                    request.Method = "POST";
                    request.ContentType = "application/x-www-form-urlencoded";
                    request.ContentLength = post_byte_array.Length;

                    using (System.IO.Stream stream = request.GetRequestStream())
                    {
                        stream.Write(post_byte_array, 0, post_byte_array.Length);
                    }

                    System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
                    System.IO.Stream dataStream = response.GetResponseStream ();
                    System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
                    string responseFromServer = await reader.ReadToEndAsync ();

                    mmria.common.model.couchdb.login_response json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.login_response>(responseFromServer);

                    mmria.common.model.couchdb.login_response[] result =  new mmria.common.model.couchdb.login_response[] 
                    { 
                        json_result
                    }; 


                    this.Response.Headers.Add("Set-Cookie", response.Headers["Set-Cookie"]);

                    string[] set_cookie = response.Headers["Set-Cookie"].Split(';');
                    string[] auth_array = set_cookie[0].Split('=');
                    if(auth_array.Length > 1)
                    {
                        string auth_session_token = auth_array[1];
                        result[0].auth_session = auth_session_token;
                    }
                    else
                    {
                        result[0].auth_session = "";
                    }

                    
                    if (json_result.ok && !string.IsNullOrWhiteSpace(json_result.name)) 
                    {

                        const string Issuer = "https://contoso.com";
                        var claims = new List<Claim>();
                        claims.Add(new Claim(ClaimTypes.Name, json_result.name, ClaimValueTypes.String, Issuer));

    
                        foreach(var role in json_result.roles)
                        {
                            if(role == "_admin")
                            {
                                claims.Add(new Claim(ClaimTypes.Role, "installation_admin", ClaimValueTypes.String, Issuer));
                            }
                        }
    

                        foreach(var role in mmria.server.util.authorization.get_current_user_role_jurisdiction_set_for(json_result.name).Select( jr => jr.role_name).Distinct())
                        {

                            claims.Add(new Claim(ClaimTypes.Role, role, ClaimValueTypes.String, Issuer));
                        }


                        Response.Cookies.Append("uid", json_result.name);
                        Response.Cookies.Append("roles", string.Join(",",json_result.roles));
                        
                        //claims.Add(new Claim("EmployeeId", string.Empty, ClaimValueTypes.String, Issuer));
                        //claims.Add(new Claim("EmployeeId", "123", ClaimValueTypes.String, Issuer));
                        //claims.Add(new Claim(ClaimTypes.DateOfBirth, "1970-06-08", ClaimValueTypes.Date));
                        //var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                        var userIdentity = new ClaimsIdentity("SuperSecureLogin");
                        userIdentity.AddClaims(claims);
                        var userPrincipal = new ClaimsPrincipal(userIdentity);

                        await HttpContext.SignInAsync(
                            CookieAuthenticationDefaults.AuthenticationScheme,
                            userPrincipal,
                            new AuthenticationProperties
                            {
                                ExpiresUtc = DateTime.UtcNow.AddMinutes(30),
                                IsPersistent = false,
                                AllowRefresh = false,
                            });
                    }

                    var Session_Event_Message = new mmria.server.model.actor.Session_Event_Message
                    (
                        DateTime.Now,
                        user.UserName,
                        _accessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                        json_result.ok && json_result.name != null? mmria.server.model.actor.Session_Event_Message.Session_Event_Message_Action_Enum.successful_login: mmria.server.model.actor.Session_Event_Message.Session_Event_Message_Action_Enum.failed_login
                    );

                    _actorSystem.ActorOf(Props.Create<mmria.server.model.actor.Record_Session_Event>()).Tell(Session_Event_Message);

                }
                

				//this.ActionContext.Response.Headers.Add("Set-Cookie", auth_session_token);

				

			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

                var Session_Event_Message = new mmria.server.model.actor.Session_Event_Message
                (
                    DateTime.Now,
                    user.UserName,
                    _accessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                    mmria.server.model.actor.Session_Event_Message.Session_Event_Message_Action_Enum.failed_login
                );

                _actorSystem.ActorOf(Props.Create<mmria.server.model.actor.Record_Session_Event>()).Tell(Session_Event_Message);

			} 
/*
            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim(ClaimTypes.Name, lookupUser.UserName));

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
 */
            if(returnUrl == null) 
            {
                returnUrl = TempData["returnUrl"]?.ToString();
            }

            if(returnUrl != null) 
            {
                return Redirect(returnUrl);
            }
            
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> Logout() 
        {
            await HttpContext.SignOutAsync
            (
                CookieAuthenticationDefaults.AuthenticationScheme,
                new AuthenticationProperties
                {
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(-5),
                    IsPersistent = false,
                    AllowRefresh = false,
                }
            );
            //Response.Cookies.Delete("uid");
            //Response.Cookies.Delete("roles");
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        [AllowAnonymous] 
        public IActionResult Forbidden()
        {
            return View();
        }


        public IActionResult Profile()
        {
            return View();
        }
    }
}