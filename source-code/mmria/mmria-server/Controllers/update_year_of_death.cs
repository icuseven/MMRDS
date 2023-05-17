using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace mmria.server.Controllers;

[Authorize(Roles  = "cdc_admin,jurisdiction_admin")]
public sealed class update_year_of_deathController : Controller
{
    private readonly IAuthorizationService _authorizationService;
    private readonly mmria.common.couchdb.ConfigurationSet _dbConfigSet;


    private System.Collections.Generic.Dictionary<string, string> YearOfDeathToDisplay;
    public update_year_of_deathController(IAuthorizationService authorizationService, mmria.common.couchdb.ConfigurationSet DbConfigurationSet)
    {
        _authorizationService = authorizationService;
        _dbConfigSet = DbConfigurationSet;

        if(_dbConfigSet.detail_list.ContainsKey("vital_import"))
        {
            _dbConfigSet.detail_list.Remove("vital_import");
        }

        YearOfDeathToDisplay = new System.Collections.Generic.Dictionary<string, string>();
        YearOfDeathToDisplay["9999"] = "(blank)";
        YearOfDeathToDisplay["1"] = "Abstracting (Incomplete)";	
        YearOfDeathToDisplay["2"] = "Abstraction Complete";
        YearOfDeathToDisplay["3"] = "Ready for Review";
        YearOfDeathToDisplay["4"] = "Review Complete and Decision Entered";
        YearOfDeathToDisplay["5"] = "Out of Scope and Death Certificate Entered";
        YearOfDeathToDisplay["6"] = "False Positive and Death Certificate Entered";
        YearOfDeathToDisplay["0"] = "Vitals Import";
    }
    public IActionResult Index()
    {
        return View(_dbConfigSet);
    }


    public async Task<IActionResult> FindRecord(mmria.server.model.year_of_death.YearOfDeathRequest Model)
    {
        var model = new mmria.server.model.year_of_death.YearOfDeathRequestResponse();
        
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
             
                string request_string = $"{Program.config_couchdb_url}/mmrds/_design/sortable/_view/by_date_last_updated?skip=0&limit=25000&descending=true";
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                responseFromServer = await case_view_curl.executeAsync();   
            }


            mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

            var Locked_status_list = new List<int>(){4,5,6};
            foreach(var item in case_view_response.rows)
            {
                try
                {
                    if
                    (
                        item.value.record_id != null &&
                        !string.IsNullOrWhiteSpace(Model.RecordId) &&
                        (
                            item.value.record_id.IndexOf(Model.RecordId, System.StringComparison.OrdinalIgnoreCase) > -1 ||
                            Model.RecordId.IndexOf(item.value.record_id, System.StringComparison.OrdinalIgnoreCase) > -1
                        )
                        /*
                        &&
                        (
                            item.value.case_status.HasValue &&
                            Locked_status_list.IndexOf(item.value.case_status.Value) > -1
                        )*/

                    )
                    {
                        var x = new mmria.server.model.year_of_death.YearOfDeathDetail()
                        {
                            _id = item.id,
                            RecordId = item.value?.record_id,
                            FirstName = item.value?.first_name,
                            LastName = item.value?.last_name,
                            MiddleName = item.value?.middle_name,
                            DateOfDeath = $"{item.value?.date_of_death_month}/{item.value.date_of_death_year}",
                            StateOfDeath = item.value?.host_state,

                            LastUpdatedBy = item.value?.last_updated_by,

                            DateLastUpdated = item.value?.date_last_updated,

                            YearOfDeath = item.value.date_of_death_year,

                            StateDatabase = Model.StateDatabase,

                            CaseStatus = item.value.case_status,

                            Role = Model.Role
                        };

                        model.YearOfDeathDetail.Add(x);
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

    public IActionResult ConfirmUpdateYearOfDeathRequest(mmria.server.model.year_of_death.YearOfDeathDetail Model)
    {
        var model = Model;

        return View(model);
    }

    
    public async Task<IActionResult> YearOfDeath(mmria.server.model.year_of_death.YearOfDeathDetail Model)
    {
        var model = Model;

        try
        {

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
                
                string request_string = $"{Program.config_couchdb_url}/mmrds/{Model._id}";
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                responseFromServer = await case_view_curl.executeAsync();
            }
            var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

            
            var dictionary = case_response as IDictionary<string,object>;
            if(dictionary != null)
            {
                var home_record = dictionary["home_record"] as IDictionary<string,object>;
                if(home_record != null)
                {
                    var date_of_death = home_record["case_status"] as IDictionary<string,object>;
                    if(date_of_death != null)
                    {
                        date_of_death["year"] = model.YearOfDeath.ToString();
                        home_record["record_id"] = model.RecordId;

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
                            string request_string = $"{Program.config_couchdb_url}/mmrds/{Model._id}";
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
                            model.StatusDisplay = $"Problem Setting Status to (blank)\n{ex}";
                        }

                        if(document_put_response.ok)
                        {
                            model.StatusDisplay = "(blank)";
                        }
                        else
                        {
                            model.StatusDisplay = "Problem Setting Status to (blank)";
                        }

                    }
                    else
                    {
                        model.StatusDisplay = "Problem Setting Status to (blank)";
                    }   
                }
                else
                {
                    model.StatusDisplay = "Problem Setting Status to (blank)";
                }
            }
            else
            {
                model.StatusDisplay = "Problem Setting Status to (blank)";
            }
            
        }
        catch(Exception ex)
        {
            model.StatusDisplay = ex.ToString();
        }

        return View(model);
    }

}
