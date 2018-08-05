using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace mmria.server.util
{  

    public enum ResourceRightEnum
    {
        ReadDeidentifiedCase,
        ReadCase,
        WriteCase,
        ReadMetadata,
        WriteMetadata,
        ReadUser,
        WriteUser,
        ReadJurisdiction,
        WriteJurisdiction
    }

    public class authorization
    {


        public static HashSet<(string jurisdiction_id, ResourceRightEnum ResourceRight)> get_current_jurisdiction_id_set_for(System.Security.Claims.ClaimsPrincipal p_claims_principal)
        {
            var result = new HashSet<(string jurisdiction_id, ResourceRightEnum ResourceRight)>();

            if (!p_claims_principal.HasClaim(c => c.Type == ClaimTypes.Name && 
                                            c.Issuer == "https://contoso.com"))
            {
                return result;
            }

            if (p_claims_principal.HasClaim(c => c.Type == ClaimTypes.Role && 
                                            c.Value == "installation_admin"))
            {

                result.Add(("/", ResourceRightEnum.ReadUser));
                result.Add(("/", ResourceRightEnum.WriteUser));
                result.Add(("/", ResourceRightEnum.ReadJurisdiction));
                result.Add(("/", ResourceRightEnum.WriteJurisdiction));

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
			
			var jurisdiction_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.user_role_jurisdiction>>(jurisdicion_result_string);
            foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.user_role_jurisdiction> jvi in jurisdiction_view_response.rows)
            {
                if(jvi.key!=null)
                {
                    switch(jvi.value.role_name)
                    {
                        case "abstractor":
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadCase));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.WriteCase));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadMetadata));
                            break;
                        case "committe_member":
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadDeidentifiedCase));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadMetadata));
                            break;
                        case "form_designer":
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.WriteMetadata));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadMetadata));
                            break;
                        case "jurisdiction_admin":
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadUser));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.WriteUser));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadMetadata));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadJurisdiction));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.WriteJurisdiction));
                            break;
                        case "installation_admin":
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadUser));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.WriteUser));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadMetadata));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.ReadJurisdiction));
                            result.Add((jvi.value.jurisdiction_id, ResourceRightEnum.WriteJurisdiction));
                            break;
                        
                    }
                    
                }
                
            }

            return result;
        }


    }
}