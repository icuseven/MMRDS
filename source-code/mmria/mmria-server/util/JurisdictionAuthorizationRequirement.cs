using System;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace mmria.server.util
{   
    public class JurisdictionAuthorizationRequirement : IAuthorizationRequirement
    {
    }


    public class HasJurisdictionAuthorizationHandler : AuthorizationHandler<JurisdictionAuthorizationRequirement>
    {
        protected override Task HandleRequirementAsync
        (
          AuthorizationHandlerContext context, 
          JurisdictionAuthorizationRequirement requirement
        )
        {
            if (!context.User.HasClaim(c => c.Type == "JurisdictionList" && 
                                            c.Issuer == "https://contoso.com"))
            {
                return Task.CompletedTask;
            }



			string jurisdicion_view_url = $"{Program.config_couchdb_url}/jurisdiction/_design/sortable/_view/by_user_id?";
			var jurisdicion_curl = new cURL("POST", null, jurisdicion_view_url, null, Program.config_timer_user_name, Program.config_timer_password);
			string jurisdicion_result_string = null;
			try
			{
				jurisdicion_result_string = jurisdicion_curl.execute();
			}
			catch(Exception ex)
			{
				System.Console.WriteLine(ex);
			}
			
			var jurisdiction_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.jurisdiction_view_response>(jurisdicion_result_string);
			//IDictionary<string, object> jurisdicion_result_dictionary = jurisdicion_result_data[0] as IDictionary<string, object>;
            //var juridiction_curl = new cURL();






            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}