using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using  mmria.server.extension; 
namespace mmria.server.Controllers;

[Authorize(Roles  = "installation_admin,cdc_admin")]
[Route("recover-deleted-case/{action=Index}")]
public sealed class recover_deleted_caseController : Controller
{
    struct Selector_Struc
    {
        //public System.Dynamic.ExpandoObject selector;
        public System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>> selector;
        public string[] fields;

        public string use_index;

        public int limit;
    }

    mmria.common.couchdb.OverridableConfiguration configuration;
    common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;

   
    mmria.common.couchdb.ConfigurationSet ConfigDB;

    readonly mmria.common.couchdb.ConfigurationSet _dbConfigSet;


    public recover_deleted_caseController
    (

        mmria.common.couchdb.ConfigurationSet p_config_db,
        IHttpContextAccessor httpContextAccessor, 
        mmria.common.couchdb.OverridableConfiguration _configuration,
        mmria.common.couchdb.ConfigurationSet DbConfigurationSet
    )
    {

        ConfigDB = p_config_db;
        configuration = _configuration;
        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();
        db_config = configuration.GetDBConfig(host_prefix);

        _dbConfigSet = DbConfigurationSet;

        if(_dbConfigSet.detail_list.ContainsKey("vital_import"))
        {
            _dbConfigSet.detail_list.Remove("vital_import");
        }
    }

    public IActionResult Index()
    {
        return View(_dbConfigSet);
    }


    public async Task<IActionResult> FindRecord(mmria.server.model.recover_deleted.Request Model)
    {
        var model = new mmria.server.model.recover_deleted.RequestResponse();
        model.SearchText = Model.RecordId;
        try
        {
            string responseFromServer  = null;

            if(Model.Role.Equals("cdc_admin", StringComparison.OrdinalIgnoreCase))
            {
                var db_info = _dbConfigSet.detail_list[Model.StateDatabase];
                string request_string = $"{db_info.url}/{db_info.prefix}audit/_design/sortable/_view/by_deleted?skip=0&limit=25000&descending=true";
                var case_view_curl = new cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                responseFromServer = await case_view_curl.executeAsync();

            }
            else
            {
             
                string request_string = $"{db_config.url}/{db_config.prefix}audit/_design/sortable/_view/by_deleted?skip=0&limit=25000&descending=true";
                var case_view_curl = new cURL("GET", null, request_string, null, db_config.user_name, db_config.user_value);
                responseFromServer = await case_view_curl.executeAsync();   
            }


            var audit_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.audit.audit_detail_view>>(responseFromServer);

            foreach(var item in audit_view_response.rows)
            {
                try
                {
                    if
                    (
                        string.IsNullOrWhiteSpace(Model.RecordId) ||

                        item.value.record_id != null &&
                        (
                            item.value.record_id.IndexOf(Model.RecordId, System.StringComparison.OrdinalIgnoreCase) > -1 ||
                            Model.RecordId.IndexOf(item.value.record_id, System.StringComparison.OrdinalIgnoreCase) > -1
                        )
                    )
                    {
                        item.value.StateDatabase = host_prefix;
                        model.Detail.Add(item.value);
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

    public IActionResult ConfirmRecoverRequest(mmria.common.model.couchdb.audit.audit_detail_view Model)
    {
        var model = Model;

    
        return View(model);
    }

    
    public async Task<IActionResult> UpdateDeletedCase(mmria.common.model.couchdb.audit.audit_detail_view Model)
    {
        var model = Model;

        try
        {
            /*

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
                
                string request_string = $"{db_config.url}/{db_config.prefix}mmrds/{Model._id}";
                var case_view_curl = new cURL("GET", null, request_string, null, db_config.user_name, db_config.user_value);
                responseFromServer = await case_view_curl.executeAsync();
            }
            var case_response = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

            
            var dictionary = case_response as IDictionary<string,object>;
            if(dictionary != null)
            {
                var home_record = dictionary["home_record"] as IDictionary<string,object>;
                if(home_record != null)
                {
                    var date_of_death = home_record["date_of_death"] as IDictionary<string,object>;
                    if(date_of_death != null)
                    {
                        
                        date_of_death["year"] = model.YearOfDeathReplacement.ToString();
                        home_record["record_id"] = model.RecordIdReplacement;

                        dictionary["last_updated_by"] = userName;
                        dictionary["date_last_updated"] = DateTime.Now;

                        Model.LastUpdatedBy = userName;
                        Model.DateLastUpdated = (DateTime) dictionary["date_last_updated"];

                        Model.DateOfDeath = Model.DateOfDeath.Replace(Model.YearOfDeath.ToString(), Model.YearOfDeathReplacement.ToString());

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
                            string request_string = $"{db_config.url}/{db_config.prefix}mmrds/{Model._id}";
                            document_curl = new cURL ("PUT", null, request_string, object_string, db_config.user_name, db_config.user_value);
                        }

                        var document_put_response = new mmria.common.model.couchdb.document_put_response();
                        try
                        {
                            responseFromServer = await document_curl.executeAsync();
                            document_put_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
                        }
                        catch(Exception ex)
                        {
                            model.StatusText = $"Problem Setting Status to (blank)\n{ex}";
                        }

                        if(document_put_response.ok)
                        {
                            model.StatusText = "(blank)";
                        }
                        else
                        {
                            model.StatusText = "Problem Setting Status to (blank)";
                        }

                    }
                    else
                    {
                        model.StatusText = "Problem Setting Status to (blank)";
                    }   
                }
                else
                {
                    model.StatusText = "Problem Setting Status to (blank)";
                }
            }
            else
            {
                model.StatusText = "Problem Setting Status to (blank)";
            }
            */
        }
        catch(Exception ex)
        {
            //model.StatusText = ex.ToString();
        }

        return View(model);
    }

    public HashSet<string> GetExistingRecordIds(string p_server_url, string user_name,  string user_value, string p_prefix = "")
    {
        var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);


        try
        {
            string request_string;

            if(string.IsNullOrWhiteSpace(p_prefix))
            {
                request_string = $"{p_server_url}/mmrds/_design/sortable/_view/by_date_created?skip=0&take=25000";
            }
            else
            {
                request_string = $"{p_server_url}/{p_prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=25000";
            }
            var case_view_curl = new mmria.getset.cURL("GET", null, request_string, null, user_name, user_value);
            string responseFromServer = case_view_curl.execute();

            mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

            foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
            {
                result.Add(cvi.value.record_id);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return result;
    }

    int my_count = -1;
    private int GenerateRandomFourDigits()
    {
        int _min = 1000;
        int _max = 9999;
        Random _rdm = new Random(System.DateTime.Now.Millisecond + my_count);
        my_count ++;
        return _rdm.Next(_min, _max);
        
    }



    (string url, string post) get_find_url()
    {
        var selector_struc = new Selector_Struc();
        selector_struc.selector = new System.Collections.Generic.Dictionary<string,System.Collections.Generic.Dictionary<string,string>>(StringComparer.OrdinalIgnoreCase);
        selector_struc.limit = 1_000_000;
        selector_struc.selector.Add("is_delete", new System.Collections.Generic.Dictionary<string,string>(StringComparer.OrdinalIgnoreCase));
        selector_struc.selector["is_delete"].Add("$eq", "true");
        selector_struc.use_index = "case-id-date-last-updated-index";

        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        string selector_struc_string = Newtonsoft.Json.JsonConvert.SerializeObject (selector_struc, settings);

        string result = $"{db_config.url}/{db_config.prefix}audit/_find";
        return (result, selector_struc_string);
    }
}
