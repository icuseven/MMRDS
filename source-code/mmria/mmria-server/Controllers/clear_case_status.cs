using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "cdc_admin")]
    //[Route("clear-case-status")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    //https://docs.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased?view=aspnetcore-2.1&tabs=aspnetcore2x
    public class clear_case_statusController : Controller
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


        public async Task<IActionResult> FindRecord(mmria.server.model.casestatus.CaseStatusRequest Model)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }
                
            var model = new mmria.server.model.casestatus.CaseStatusRequestResponse();
            
            try
            {
                var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
                string request_string = $"{db_info.url}/{db_info.prefix}mmrds/_design/sortable/_view/by_date_last_updated?skip=0&limit=25000&descending=true";
                var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                string responseFromServer = await case_view_curl.executeAsync();

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
                            &&
                            (
                                item.value.case_status.HasValue &&
                                Locked_status_list.IndexOf(item.value.case_status.Value) > -1
                            )

                        )
                        {
                            var x = new mmria.server.model.casestatus.CaseStatusDetail()
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

                                CaseStatus = (item.value.case_status != null && CaseStatusToDisplay.ContainsKey(item.value.case_status.ToString())) ? CaseStatusToDisplay[item.value.case_status.ToString()] : "(blank)" ,

                                StateDatabase = Model.StateDatabase
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

        public async Task<IActionResult> ConfirmClearCaseStatusRequest(mmria.server.model.casestatus.CaseStatusDetail Model)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }


            var model = Model;

           return View(model);
        }

        
        public async Task<IActionResult> ClearCaseStatus(mmria.server.model.casestatus.CaseStatusDetail Model)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }

            var model = Model;

            try
            {
            
                var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
                string request_string = $"{db_info.url}/{db_info.prefix}mmrds/{Model._id}";
                var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                string responseFromServer = await case_view_curl.executeAsync();

                var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

                
                var dictionary = case_response as IDictionary<string,object>;
                if(dictionary != null)
                {
                    var home_record = dictionary["home_record"] as IDictionary<string,object>;
                    if(home_record != null)
                    {
                        var case_status = home_record["case_status"] as IDictionary<string,object>;
                        if(case_status != null)
                        {
                            case_status["overall_case_status"] = 9999;
                            case_status["case_locked_date"] = "";

                            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
                            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                            var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_response, settings);


                            
                            cURL document_curl = new cURL ("PUT", null, request_string, object_string, db_info.user_name, db_info.user_value);

                            var document_put_response = new mmria.common.model.couchdb.document_put_response();
                            try
                            {
                                responseFromServer = await document_curl.executeAsync();
                                document_put_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                            }
                            catch(Exception ex)
                            {
                                model.CaseStatus = $"Problem Setting Status to (blank)\n{ex}";
                            }

                            if(document_put_response.ok)
                            {
                                model.CaseStatus = "(blank)";
                            }
                            else
                            {
                                model.CaseStatus = "Problem Setting Status to (blank)";
                            }




                        }
                        else
                        {
                            model.CaseStatus = "Problem Setting Status to (blank)";
                        }   
                    }
                    else
                    {
                        model.CaseStatus = "Problem Setting Status to (blank)";
                    }
                }
                else
                {
                    model.CaseStatus = "Problem Setting Status to (blank)";
                }
                
            }
            catch(Exception ex)
            {
                model.CaseStatus = ex.ToString();
            }


           

           return View(model);
        }

    }
}