using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace mmria.server.util
{  
    public class case_authorization
    {

        public static bool is_authorized_to_handle_jurisdiction_id
        (
          System.Security.Claims.ClaimsPrincipal p_claims_principal, 
          System.Dynamic.ExpandoObject p_case_expando_object
        )
        {

            bool result = false;

            var jurisdiction_hashset = mmria.server.util.case_authorization.get_current_jurisdiction_id_set_for(p_claims_principal);
           
            var byName = (IDictionary<string,object>)p_case_expando_object;

            if(byName.ContainsKey("jurisdiction_id"))
            {

                var regex = new System.Text.RegularExpressions.Regex("^" + @byName["jurisdiction_id"]);
                foreach(string jurisdiction_id in  jurisdiction_hashset)
                {
                    if(regex.IsMatch(jurisdiction_id))
                    {
                        result = true;
                        break;
                    }
                }

            }
            else
            {
                byName.Add("jurisdiction_id", "/");
                result = true;
            }

            return result;
        }

        public static bool is_authorized_to_handle_jurisdiction_id
        (
          System.Security.Claims.ClaimsPrincipal p_claims_principal, 
          string jurisdiction_id
        )
        {

            bool result = false;

            var jurisdiction_hashset = mmria.server.util.case_authorization.get_current_jurisdiction_id_set_for(p_claims_principal);

            
            foreach(string jurisdiction_item in jurisdiction_hashset)
            {
                var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item);
                if(regex.IsMatch(jurisdiction_id))
                {
                    result = true;
                    break;
                }
            }

            return result;
        }

        public static HashSet<string> get_current_jurisdiction_id_set_for(System.Security.Claims.ClaimsPrincipal p_claims_principal)
        {
            HashSet<string> result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            if (!p_claims_principal.HasClaim(c => c.Type == ClaimTypes.Name && 
                                            c.Issuer == "https://contoso.com"))
            {
                return result;
            }

            var user_name = p_claims_principal.Claims.Where(c => c.Type == ClaimTypes.Name).FirstOrDefault().Value; 

			string jurisdicion_view_url = $"{Program.config_couchdb_url}/jurisdiction/_design/sortable/_view/by_user_id?{user_name}";
			var jurisdicion_curl = new cURL("GET", null, jurisdicion_view_url, null, Program.config_timer_user_name, Program.config_timer_password);
			string jurisdicion_result_string = null;
			try
			{
				jurisdicion_result_string = jurisdicion_curl.execute();
			}
			catch(Exception ex)
			{
				System.Console.WriteLine(ex);
                return result;
			}
			
			var jurisdiction_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.jurisdiction_view_sortable_item>>(jurisdicion_result_string);
            foreach(mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.jurisdiction_view_sortable_item> jvi in jurisdiction_view_response.rows)
            {
                if(jvi.key!=null)
                {
                    result.Add(jvi.value.jurisdiction_id);
                }
                
            }

            return result;
        }

        public static HashSet<string> get_user_jurisdiction_set()
        {
            HashSet<string> result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

			string jurisdicion_view_url = $"{Program.config_couchdb_url}/jurisdiction/_design/sortable/_view/by_user_id";
			var jurisdicion_curl = new cURL("GET", null, jurisdicion_view_url, null, Program.config_timer_user_name, Program.config_timer_password);
			string jurisdicion_result_string = null;
			try
			{
				jurisdicion_result_string = jurisdicion_curl.execute();
			}
			catch(Exception ex)
			{
				System.Console.WriteLine(ex);
                return result;
			}
			
			var jurisdiction_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.jurisdiction_view_sortable_item>>(jurisdicion_result_string);
            foreach(mmria.common.model.couchdb.get_response_item<mmria.common.model.couchdb.jurisdiction_view_sortable_item> jvi in jurisdiction_view_response.rows)
            {
                if(jvi.key!=null)
                {
                    result.Add($"{jvi.value.jurisdiction_id},{jvi.value.user_id}");
                }
                
            }

            return result;
        }
    }
}