using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;

namespace mmria.pmss.server.Controllers;

[Authorize(Roles  = "cdc_admin,jurisdiction_admin")]
public sealed class clear_case_statusController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    private readonly mmria.common.couchdb.ConfigurationSet _dbConfigSet;


    private System.Collections.Generic.Dictionary<string, string> CaseStatusToDisplay;
    public clear_case_statusController(IAuthorizationService authorizationService, mmria.common.couchdb.ConfigurationSet DbConfigurationSet)
    {
        _authorizationService = authorizationService;
        _dbConfigSet = DbConfigurationSet;

        if(_dbConfigSet.detail_list.ContainsKey("vital_import"))
        {
            _dbConfigSet.detail_list.Remove("vital_import");
        }

        CaseStatusToDisplay = new System.Collections.Generic.Dictionary<string, string>();
        CaseStatusToDisplay["9999"] = "(blank)";
        CaseStatusToDisplay["1"] = "Abstracting (Incomplete)";	
        CaseStatusToDisplay["2"] = "Abstraction Complete";
        CaseStatusToDisplay["3"] = "Ready for Review";
        CaseStatusToDisplay["4"] = "Review Complete and Decision Entered";
        CaseStatusToDisplay["5"] = "Out of Scope and Death Certificate Entered";
        CaseStatusToDisplay["6"] = "False Positive and Death Certificate Entered";
        CaseStatusToDisplay["0"] = "Vitals Import";
    }
    public IActionResult Index()
    {
        return View(_dbConfigSet);
    }


    public async Task<IActionResult> FindRecord(mmria.pmss.server.model.casestatus.CaseStatusRequest Model)
    {
        var model = new mmria.pmss.server.model.casestatus.CaseStatusRequestResponse();
        
        try
        {
            string responseFromServer  = null;

            if(Model.Role.Equals("cdc_admin", StringComparison.OrdinalIgnoreCase))
            {
                var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
                string request_string = $"{db_info.url}/{db_info.prefix}mmrds/_design/sortable/_view/by_date_last_updated?skip=0&limit=25000&descending=true";
                var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                responseFromServer = await case_view_curl.executeAsync();

            }
            else
            {
             
                string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/by_date_last_updated?skip=0&limit=25000&descending=true";
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                responseFromServer = await case_view_curl.executeAsync();   
            }


            mmria.common.model.couchdb.pmss_case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.pmss_case_view_response>(responseFromServer);

            var Locked_status_list = new List<int>(){4,5,6};
            foreach(var item in case_view_response.rows)
            {
                try
                {
                    if
                    (
                        item.value.pmssno != null &&
                        !string.IsNullOrWhiteSpace(Model.RecordId) &&
                        (
                            item.value.pmssno.IndexOf(Model.RecordId, System.StringComparison.OrdinalIgnoreCase) > -1 ||
                            Model.RecordId.IndexOf(item.value.pmssno, System.StringComparison.OrdinalIgnoreCase) > -1
                        )
                        /*
                        &&
                        (
                            item.value.case_status.HasValue &&
                            Locked_status_list.IndexOf(item.value.case_status.Value) > -1
                        )*/

                    )
                    {
                        var x = new mmria.pmss.server.model.casestatus.CaseStatusDetail()
                        {
                            _id = item.id,
                            RecordId = item.value?.pmssno,
                            FirstName = item.value?.first_name,
                            LastName = item.value?.last_name,
                            MiddleName = item.value?.middle_name,
                            DateOfDeath = $"{item.value?.date_of_death_month}/{item.value.date_of_death_year}",
                            StateOfDeath = item.value?.host_state,

                            LastUpdatedBy = item.value?.last_updated_by,

                            DateLastUpdated = item.value?.date_last_updated,

                            //CaseStatus = item.value.case_status,

                            //CaseStatusDisplay = (item.value.case_status != null && CaseStatusToDisplay.ContainsKey(item.value.case_status.ToString())) ? CaseStatusToDisplay[item.value.case_status.ToString()] : "(blank)" ,

                            StateDatabase = Model.StateDatabase,

                            Role = Model.Role
                        };

                        model.CaseStatusDetail.Add(x);
                    }
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex);
                }
            
            }
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex);
        }


        return View(model);
    }

    public IActionResult ConfirmClearCaseStatusRequest(mmria.pmss.server.model.casestatus.CaseStatusDetail Model)
    {
        var model = Model;

        return View(model);
    }

    
    public async Task<IActionResult> ClearCaseStatus(mmria.pmss.server.model.casestatus.CaseStatusDetail Model)
    {
        var model = Model;

        try
        {

            var userName = "";
            if (User.Identities.Any(u => u.IsAuthenticated))
            {
                userName = User.Identities.First(
                    u => u.IsAuthenticated && 
                    u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
            }


            string responseFromServer = null;
            if(Model.Role.Equals("cdc_admin", StringComparison.OrdinalIgnoreCase))
            {
        
                var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
                string request_string = $"{db_info.url}/{db_info.prefix}mmrds/{Model._id}";
                var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                responseFromServer = await case_view_curl.executeAsync();
            }
            else
            {
                
                string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{Model._id}";
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                responseFromServer = await case_view_curl.executeAsync();
            }
            var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

            
            var dictionary = case_response as IDictionary<string,object>;
            if(dictionary != null)
            {
                var tracking = dictionary["tracking"] as IDictionary<string,object>;
                if(tracking != null)
                {
                    var case_status = tracking["case_status"] as IDictionary<string,object>;
                    if(case_status != null)
                    {
                        case_status["overall_case_status"] = 9999;
                        case_status["case_locked_date"] = "";

                        dictionary["last_updated_by"] = userName;
                        dictionary["date_last_updated"] = DateTime.Now;

                        Model.LastUpdatedBy = userName;
                        Model.DateLastUpdated = (DateTime) dictionary["date_last_updated"];


                        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                        var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_response, settings);

                        cURL document_curl = null;

                        if(Model.Role.Equals("cdc_admin", StringComparison.OrdinalIgnoreCase))
                        {
                            var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
                            string request_string = $"{db_info.url}/{db_info.prefix}mmrds/{Model._id}";
                            document_curl = new cURL ("PUT", null, request_string, object_string, db_info.user_name, db_info.user_value);
                        }
                        else
                        {
                            string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{Model._id}";
                            document_curl = new cURL ("PUT", null, request_string, object_string, Program.config_timer_user_name, Program.config_timer_value);
                        }

                        var document_put_response = new mmria.common.model.couchdb.document_put_response();
                        try
                        {
                            responseFromServer = await document_curl.executeAsync();
                            document_put_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                        }
                        catch(Exception ex)
                        {
                            model.CaseStatusDisplay = $"Problem Setting Status to (blank)\n{ex}";
                        }

                        if(document_put_response.ok)
                        {
                            model.CaseStatusDisplay = "(blank)";
                        }
                        else
                        {
                            model.CaseStatusDisplay = "Problem Setting Status to (blank)";
                        }




                    }
                    else
                    {
                        model.CaseStatusDisplay = "Problem Setting Status to (blank)";
                    }   
                }
                else
                {
                    model.CaseStatusDisplay = "Problem Setting Status to (blank)";
                }
            }
            else
            {
                model.CaseStatusDisplay = "Problem Setting Status to (blank)";
            }
            
        }
        catch(Exception ex)
        {
            model.CaseStatusDisplay = ex.ToString();
        }

        return View(model);
    }

}