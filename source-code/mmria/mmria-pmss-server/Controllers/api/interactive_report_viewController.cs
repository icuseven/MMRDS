using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using mmria.common.functional;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace mmria.pmss.server;

[Authorize(Roles  = "abstractor, data_analyst")]
[Route("api/measure-indicator/{indicator_id}")]
public sealed class interactive_report_viewController: ControllerBase 
{  

    IConfiguration configuration;

    public interactive_report_viewController(IConfiguration p_configuration)
    {
        configuration = p_configuration;
    }
    public async Task<IList<mmria.pmss.server.model.report_measure_value_struct>> Get(string indicator_id)
    {
        var result = new List<mmria.pmss.server.model.report_measure_value_struct>();
        
        
        var config_couchdb_url = configuration["mmria_settings:couchdb_url"];
        var config_timer_user_name = configuration["mmria_settings:timer_user_name"];
        var config_timer_value = configuration["mmria_settings:timer_password"];
        var config_db_prefix = "";
        
        if(!string.IsNullOrWhiteSpace(configuration["mmria_settings:db_prefix"]))
        {
            config_db_prefix = configuration["mmria_settings:db_prefix"];
        }

        try
        {

            string find_url = $"{config_couchdb_url}/{config_db_prefix}report/_design/interactive_aggregate_report/_view/indicator_id?skip=0&limit={30000}&key=\"{indicator_id}\"";
            var case_curl = new cURL("GET", null, find_url, null, config_timer_user_name, config_timer_value);
            string responseFromServer = await case_curl.executeAsync();
            
            var jurisdiction_hashset = mmria.pmss.server.utils.authorization.get_current_jurisdiction_id_set_for(User);


            List<mmria.pmss.server.model.c_opioid_report_object> new_list = new();
            var response_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.pmss.server.model.report_measure_value_struct>>(responseFromServer);

            if(!string.IsNullOrWhiteSpace(indicator_id))
            {
                foreach(var doc in response_result.rows)
                {
                    if(doc.key.ToLower() == indicator_id.ToLower())
                    {
                        foreach(var jurisdiction_item in  jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + jurisdiction_item.jurisdiction_id);
                            if
                            (
                                regex.IsMatch(doc.value.jurisdiction_id) && 
                                utils.ResourceRightEnum.ReadCase ==  jurisdiction_item.ResourceRight
                            )
                            {
                                if
                                (
                                    doc.value.year_of_death.HasValue && doc.value.year_of_death.Value != 9999 &&
                                    doc.value.month_of_death.HasValue && doc.value.month_of_death.Value != 9999 &&
                                    doc.value.day_of_death.HasValue && doc.value.day_of_death.Value != 9999 &&
                                    doc.value.case_review_day.HasValue && doc.value.case_review_day.Value != 9999 && 
                                    doc.value.case_review_month.HasValue && doc.value.case_review_month.Value != 9999 &&
                                    doc.value.case_review_year.HasValue && doc.value.case_review_year.Value != 9999
                                )
                                {
                                    result.Add(doc.value);
                                }
                                break;
                            }
                        }
                    }
                    
                }
            }
            else
            {
                foreach(var doc in response_result.rows)
                {
                    foreach(var jurisdiction_item in  jurisdiction_hashset)
                    {
                        var regex = new System.Text.RegularExpressions.Regex("^" + jurisdiction_item.jurisdiction_id);
                        if
                        (
                            regex.IsMatch(doc.value.jurisdiction_id) && 
                            utils.ResourceRightEnum.ReadCase ==  jurisdiction_item.ResourceRight
                        )
                        {
                            if
                            (
                                doc.value.year_of_death.HasValue && doc.value.year_of_death.Value != 9999 &&
                                doc.value.month_of_death.HasValue && doc.value.month_of_death.Value != 9999 &&
                                doc.value.day_of_death.HasValue && doc.value.day_of_death.Value != 9999 &&
                                doc.value.case_review_day.HasValue && doc.value.case_review_day.Value != 9999 && 
                                doc.value.case_review_month.HasValue && doc.value.case_review_month.Value != 9999 &&
                                doc.value.case_review_year.HasValue && doc.value.case_review_year.Value != 9999
                            )
                            {
                                result.Add(doc.value);
                            }
                            break;
                        }
                    }
                }
            }


            System.Console.WriteLine($"case_response.docs.length {result.Count}");
        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
        }

        return result;
    }




} 

