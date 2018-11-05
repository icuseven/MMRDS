using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Web;
using System.Net.Http;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Akka.Actor;

/*
https://github.com/18F/identity-oidc-aspnet

*/

namespace mmria.common.Controllers
{
    public partial class AccountController : Controller
    {
        public const string ClientId = "urn:gov:gsa:openidconnect.profiles:sp:sso:logingov:aspnet_example";
        public const string ClientUrl = "http://localhost:50764";
        public const string IdpUrl = "https://idp.int.identitysandbox.gov";
        public const string AcrValues = "http://idmanagement.gov/ns/assurance/loa/1";


       // private IConfiguration _configuration;
        private IHttpContextAccessor _accessor;
        private ActorSystem _actorSystem;


        public AccountController(IHttpContextAccessor httpContextAccessor, ActorSystem actorSystem, IConfiguration configuration)
        {
            _accessor = httpContextAccessor;
            _actorSystem = actorSystem;
            _configuration = configuration;
        }
        private IConfiguration _configuration;

        public ActionResult Index()
        {
            if (TempData["email"] == null)
            {
                ViewBag.Message = "Log in to see your account.";
            }
            else
            {
                ViewBag.Message = $"Welcome back {TempData["email"]}!";
                ViewBag.Content = $"Your user ID is: {TempData["id"]}";
            }
            return View();
        }

        [AllowAnonymous] 
        public ActionResult SignIn()
        {

            var sams_endpoint_authorization = _configuration["sams:endpoint_authorization"];
            var sams_endpoint_token = _configuration["sams:endpoint_token"];
            var sams_endpoint_user_info = _configuration["sams:endpoint_user_info"];
            var sams_endpoint_token_validation = _configuration["sams:token_validation"];
            var sams_endpoint_user_info_sys = _configuration["sams:user_info_sys"];
            var sams_client_id = _configuration["sams:client_id"];
            var sams_callback_url = _configuration["sams:callback_url"];        

            var state = Guid.NewGuid().ToString("N");
            var nonce = Guid.NewGuid().ToString("N");

            var url = $"{sams_endpoint_authorization}?" +
                "&acr_values=" + System.Web.HttpUtility.HtmlEncode(AcrValues) +
                "&client_id=" + sams_client_id +
                "&prompt=select_account" +
                "&redirect_uri=" + $"{ClientUrl}/Account/SignInCallback" +
                "&response_type=code" +
                "&scope=openid+email" +
                "&state=" + state +
                "&nonce=" + nonce;
            System.Diagnostics.Debug.WriteLine($"url: {url}");


            var sams_url = $"{sams_endpoint_authorization}?" +
                "&acr_values=" + System.Web.HttpUtility.HtmlEncode(AcrValues) +
                "&client_id=" + sams_client_id +
                "&prompt=select_account" +
                "&redirect_uri=" + $"{sams_callback_url}" +
                "&response_type=code" +
                "&scope=openid+email" +
                "&state=" + state +
                "&nonce=" + nonce;
            System.Diagnostics.Debug.WriteLine($"url: {url}");

            return Redirect(sams_url);
        }

        [AllowAnonymous] 
        public async Task<ActionResult> SignInCallback()
        {
            var sams_endpoint_authorization = _configuration["sams:endpoint_authorization"];
            var sams_endpoint_token = _configuration["sams:endpoint_token"];
            var sams_endpoint_user_info = _configuration["sams:endpoint_user_info"];
            var sams_endpoint_token_validation = _configuration["sams:token_validation"];
            var sams_endpoint_user_info_sys = _configuration["sams:endpoint_user_info_sys"];
            var sams_client_id = _configuration["sams:client_id"];
            var sams_client_secret = _configuration["sams:client_secret"];
            
            var sams_callback_url = _configuration["sams:callback_url"];        
//?code=6c17b2a3-d65a-44fd-a28c-9aee982f80be&state=a4c8326ca5574999aa13ca02e9384c3d
            // Retrieve code and state from query string, pring for debugging
            var querystring = Request.QueryString.Value;
            var querystring_skip = querystring.Substring(1, querystring.Length -1);
            var querystring_array = querystring_skip.Split("&");

            var querystring_dictionary = new Dictionary<string,string>();
            foreach(string item in querystring_array)
            {
                var pair = item.Split("=");
                querystring_dictionary.Add(pair[0], pair[1]);
            }

            var code = querystring_dictionary["code"];
            var state = querystring_dictionary["state"];
            System.Diagnostics.Debug.WriteLine($"code: {code}");
            System.Diagnostics.Debug.WriteLine($"state: {state}");




            HttpClient client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, sams_endpoint_token);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string> {
                { "client_id", sams_client_id },
                { "client_secret", sams_client_secret },
                { "grant_type", "client_credentials" },
                //{ "scope", "MMRIA" },
            });

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var payload = JObject.Parse(await response.Content.ReadAsStringAsync());
            var token = payload.Value<string>("access_token");
            var scope = payload.Value<string>("scope");


            var user_info_sys_request = new HttpRequestMessage(HttpMethod.Post, sams_endpoint_user_info_sys);
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token); 
            /*
            user_info_sys_request.Content = new FormUrlEncodedContent(new Dictionary<string, string> {
                { "client_id", sams_client_id },
                { "client_secret", sams_client_secret },
                //{ "grant_type", "client_credentials" },
                //{ "scope", "MMRIA" },
            });
             */



            response = await client.SendAsync(user_info_sys_request);
            response.EnsureSuccessStatusCode();

            var temp_string = await response.Content.ReadAsStringAsync();
            payload = JObject.Parse(temp_string);

            
            var email = payload.Value<string>("email");

            //return RedirectToAction("Index", "HOME");
            return RedirectToAction("Index", "HOME");



            // Generate JWT for token request
            //var cert = new X509Certificate2(Server.MapPath("~/App_Data/cert.pfx"), "1234");
            /*
            var cert = new X509Certificate2();
            var signingCredentials = new SigningCredentials(new X509SecurityKey(cert), SecurityAlgorithms.RsaSha256);
            var header = new JwtHeader(signingCredentials);
             
            var header = new JwtHeader();
            var payload = new JwtPayload
            {
                {"iss", sams_client_id},
                {"sub", sams_client_id},
                {"aud", $"{sams_endpoint_token}"},
                {"jti", Guid.NewGuid().ToString("N")},
                {"exp", (int)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds + 5 * 60}
            };
            var securityToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();
            var tokenString = handler.WriteToken(securityToken);

            // Send POST to make token request
            using (var wb = new WebClient())
            {
                var data = new NameValueCollection();
                data["client_assertion"] = tokenString;
                data["client_assertion_type"] = HttpUtility.HtmlEncode("urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
                data["code"] = code;
                data["grant_type"] = "authorization_code";

                //var response = wb.UploadValues($"{IdpUrl}/api/openid_connect/token", "POST", data);
                var response = wb.UploadValues($"{sams_endpoint_token}", "POST", data);

                var responseString = Encoding.ASCII.GetString(response);
                dynamic tokenResponse = JObject.Parse(responseString);

                var token = handler.ReadToken((String)tokenResponse.id_token) as JwtSecurityToken;
                var userId = token.Claims.First(c => c.Type == "sub").Value;
                var userEmail = token.Claims.First(c => c.Type == "email").Value;

                TempData["id"] = userId;
                TempData["email"] = userEmail;
                //return RedirectToAction("Index", "HOME");
                return RedirectToAction("Index", "HOME");
            }*/
        }
    }
}
