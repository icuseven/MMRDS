using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace mmria.server.Controllers
{
    [Authorize(Roles  = "cdc_analyst")]
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

            var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
            string request_string = $"{db_info.url}/{db_info.prefix}mmrds/_design/sortable/_view/by_date_last_updated?skip=0&limit=25000&descending=true";
            var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
            string responseFromServer = await case_view_curl.executeAsync();

            mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);
            var model = new mmria.server.model.casestatus.CaseStatusRequestResponse();
            foreach(var item in case_view_response.rows)
            {
                try
                {
                    if
                    (
                        item.value.record_id != null &&
                        (
                            item.value.record_id.IndexOf(Model.RecordId, System.StringComparison.OrdinalIgnoreCase) > -1 ||
                            Model.RecordId.IndexOf(item.value.record_id, System.StringComparison.OrdinalIgnoreCase) > -1
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

                            CaseStatus = (item.value.case_status != null && CaseStatusToDisplay.ContainsKey(item.value.case_status.ToString())) ? CaseStatusToDisplay[item.value.case_status.ToString()] : "(blank)" 
                        };

                        model.CaseStatusDetail.Add(x);
                    }
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex);
                }
            
            }


           return View(model);
        }

        public async Task<IActionResult> ConfirmClearCaseStatusRequest(string _id)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }
/*
            var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
            string request_string = $"{db_info.url}/{db_info.prefix}mmrds/{_id}";
            var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
            string responseFromServer = await case_view_curl.executeAsync();

            mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);
            var model = new mmria.server.model.casestatus.CaseStatusRequestResponse();
*/
            var model = new mmria.server.model.casestatus.CaseStatusDetail();

           return View(model);
        }

        
        public async Task<IActionResult> ClearCaseStatus(string _id)
        {
            if (!ModelState.IsValid)
            {
                 View();
            }

            var model = new mmria.server.model.casestatus.CaseStatusResult();

           return View(model);
        }

    }
}