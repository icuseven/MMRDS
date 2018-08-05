using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace mmria.server.util
{  
    public class authorization_case
    {

        public static bool is_authorized_to_handle_jurisdiction_id
        (
          System.Security.Claims.ClaimsPrincipal p_claims_principal, 
          ResourceRightEnum p_resoure_right_enum,
          System.Dynamic.ExpandoObject p_case_expando_object
        )
        {

            bool result = false;

            var jurisdiction_hashset = mmria.server.util.authorization.get_current_jurisdiction_id_set_for(p_claims_principal);
           
            var byName = (IDictionary<string,object>)p_case_expando_object;

            if(byName.ContainsKey("jurisdiction_id"))
            {

                var regex = new System.Text.RegularExpressions.Regex("^" + @byName["jurisdiction_id"]);
                foreach(var jurisdiction_item in  jurisdiction_hashset)
                {
                    if
                    (
                        regex.IsMatch(jurisdiction_item.jurisdiction_id) && 
                        p_resoure_right_enum ==  jurisdiction_item.ResourceRight
                    )
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
          ResourceRightEnum p_resoure_right_enum,
          string jurisdiction_id
        )
        {

            bool result = false;

            var jurisdiction_hashset = mmria.server.util.authorization.get_current_jurisdiction_id_set_for(p_claims_principal);

            
            foreach(var jurisdiction_item in jurisdiction_hashset)
            {
                var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);
                if
                (
                    regex.IsMatch(jurisdiction_id) &&
                    p_resoure_right_enum == jurisdiction_item.ResourceRight
                )
                {
                    result = true;
                    break;
                }
            }

            return result;
        }


        public static HashSet<(string jurisdiction_id, string user_id, string role_name)> get_user_jurisdiction_set()
        {
            HashSet<(string,string,string)> result = new HashSet<(string,string,string)>();

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
			
			var jurisdiction_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>>(jurisdicion_result_string);
            foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.user_role_jurisdiction> jvi in jurisdiction_view_response.rows)
            {
                if(jvi.key!=null)
                {
                    result.Add((jvi.value.jurisdiction_id,jvi.value.user_id, jvi.value.role_name));
                }
                
            }

            return result;
        }
    }
}