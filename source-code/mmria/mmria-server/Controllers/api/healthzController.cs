using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    
    [Route("api/[controller]")]
    [AllowAnonymous] 
    public class healthzController : Controller
    {

        private IConfiguration configuration { get; }
        
        public healthzController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }

        [HttpGet]
		public async Task<IActionResult> Index()
        {

            if (!await url_endpoint_exists (Program.config_couchdb_url + $"/{Program.db_prefix}mmrds", Program.config_timer_user_name, Program.config_timer_value)) 
            {
                return StatusCode(500); 
            }
            else
            {
                return Ok(); 
            }
            
        }

        async Task<bool> url_endpoint_exists (string p_target_server, string p_user_name, string p_value, string p_method = "HEAD")
        {
            System.Net.HttpStatusCode response_result;

            try
            {
                //Creating the HttpWebRequest
                System.Net.HttpWebRequest request = System.Net.WebRequest.Create(p_target_server) as System.Net.HttpWebRequest;
                //Setting the Request method HEAD, you can also use GET too.

                if(request != null)
                {
                    request.Method = p_method;

                    if (!string.IsNullOrWhiteSpace(p_user_name) && !string.IsNullOrWhiteSpace(p_value))
                    {
                        string encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(p_user_name + ":" + p_value));
                        request.Headers.Add("Authorization", "Basic " + encoded);
                    }

                    //Getting the Web Response.
                    System.Net.HttpWebResponse response = await request.GetResponseAsync() as System.Net.HttpWebResponse;
                    //Returns TRUE if the Status code == 200
                    if(response != null)
                    {
                        response_result = response.StatusCode;
                        response.Close();
                        return (response_result == System.Net.HttpStatusCode.OK);
                    }
                    else
                    {
                        return false;
                    }
                }
                return  false;
            }
            catch (Exception ex) 
            {
                //Log.Information ($"failed end_point exists check: {p_target_server}\n{ex}");
                //Log.Information ($"failed end_point exists check: {p_target_server}");
                return false;
            }            
        }

    }
}