using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Dynamic;
using mmria.common;
using Microsoft.Extensions.Configuration;
using Akka.Actor;
using Microsoft.AspNetCore.Authorization;

namespace mmria.pmss.server;


[Route("api/[controller]")]
public sealed class caseController: ControllerBase 
{ 


    private ActorSystem _actorSystem;


    private readonly IAuthorizationService _authorizationService;
    //private readonly IDocumentRepository _documentRepository;

    public caseController(ActorSystem actorSystem, IAuthorizationService authorizationService)
    {
        _actorSystem = actorSystem;
        _authorizationService = authorizationService;
    }
    
    [Authorize(Roles  = "abstractor, data_analyst")]
    [HttpGet]
    public async Task<System.Dynamic.ExpandoObject> Get(string case_id) 
    { 
        try
        {
            string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_all_docs?include_docs=true";

            if (!string.IsNullOrWhiteSpace (case_id)) 
            {
                request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{case_id}";
                var case_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_curl.executeAsync();

                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                if(mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.ReadCase, result))
                {
                    return result;
                }
                else
                {
                    return null;
                }

            } 

        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return null;
    } 





    [Authorize(Roles  = "abstractor")]
    [HttpPost]
    public async Task<mmria.common.model.couchdb.document_put_response> Post
    (
        [FromBody] mmria.common.model.couchdb.Save_Case_Request save_case_request
    ) 
    { 

        var case_post_request = save_case_request.Case_Data;

        string auth_session_token = null;

        string object_string = null;
        mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();


        try
        {

            var userName = "";
            if (User.Identities.Any(u => u.IsAuthenticated))
            {
                userName = User.Identities.First(
                    u => u.IsAuthenticated && 
                    u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
            }

            var byName = (IDictionary<string,object>)case_post_request;
            var created_by = byName["created_by"] as string;
            if(string.IsNullOrWhiteSpace(created_by))
            {
                byName["created_by"] = userName;
            } 

            if(byName.ContainsKey("last_updated_by"))
            {
                byName["last_updated_by"] = userName;
            }
            else
            {
                byName.Add("last_updated_by", userName);
                
            }


            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            object_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_post_request, settings);

            
            var temp_id = byName["_id"]; 
            string id_val = null;

            if(temp_id is DateTime)
            {
                id_val = string.Concat(((DateTime)temp_id).ToString("s"), "Z");
            }
            else
            {
                id_val = temp_id.ToString();
            }



            var tracking = (IDictionary<string,object>)byName["tracking"];
            if(!tracking.ContainsKey("jurisdiction_id"))
            {
                tracking.Add("jurisdiction_id", "/");
            }

            if(!mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.WriteCase, tracking["jurisdiction_id"].ToString()))
            {
                Console.Write($"unauthorized PUT {tracking["jurisdiction_id"]}: {byName["_id"]}");
                return result;
            }


            // begin - check if doc exists
            try 
            {
                var check_document_curl = new cURL ("GET", null, $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{id_val}", null, Program.config_timer_user_name, Program.config_timer_value);
                string check_document_json = await check_document_curl.executeAsync ();
                var check_document_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (check_document_json);
                IDictionary<string, object> result_dictionary = check_document_expando_object as IDictionary<string, object>;

                if
                (
                    result_dictionary != null && 
                    !mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.WriteCase, check_document_expando_object)
                )
                {
                    Console.Write($"unauthorized PUT {result_dictionary["jurisdiction_id"]}: {result_dictionary["_id"]}");
                    return result;
                }

            } 
            catch (Exception ex) 
            {
                // do nothing for now document doesn't exsist.
                System.Console.WriteLine ($"err caseController.Post\n{ex}");
            }
            // end - check if doc exists




            string metadata_url = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/{id_val}";
            cURL document_curl = new cURL ("PUT", null, metadata_url, object_string, Program.config_timer_user_name, Program.config_timer_value);

            try
            {
                string responseFromServer = await document_curl.executeAsync();
                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
            }
            catch(Exception ex)
            {
                Console.Write("auth_session_token: {0}", auth_session_token);
                Console.WriteLine(ex);
            }


            var audit_data = save_case_request.Change_Stack;

            var audit_string = Newtonsoft.Json.JsonConvert.SerializeObject(audit_data, settings);

            string audit_url = $"{Program.config_couchdb_url}/{Program.db_prefix}audit/{audit_data._id}";
            cURL audit_curl = new cURL ("PUT", null, audit_url, audit_string, Program.config_timer_user_name, Program.config_timer_value);

            try
            {
                string responseFromServer = await audit_curl.executeAsync();
                var audit_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
            }
            catch(Exception ex)
            {
                Console.Write("problem saving audit\n{0}", ex);

            }

            var Sync_Document_Message = new mmria.pmss.server.model.actor.Sync_Document_Message
            (
                id_val,
                    object_string
            );

            _actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.Synchronize_Case>()).Tell(Sync_Document_Message);
    
            /*
            var case_sync_actor = _actorSystem.ActorSelection("akka://mmria-actor-system/user/case_sync_actor");
            case_sync_actor.Tell(Sync_Document_Message);
            */
            if (!result.ok)
            {

            }

        }
        catch(Exception ex) 
        {
            Console.Write("auth_session_token: {0}", auth_session_token);
            Console.WriteLine (ex);
        }

        return result;

    } 

    [Authorize(Roles  = "abstractor")]
    [HttpDelete]
    public async Task<System.Dynamic.ExpandoObject> Delete(string case_id = null, string rev = null) 
    { 
        try
        {
            string request_string = null;
            //mmria.pmss.server.utils.c_sync_document sync_document = null;

            if (!string.IsNullOrWhiteSpace (case_id) && !string.IsNullOrWhiteSpace (rev)) 
            {
                request_string = Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/" + case_id + "?rev=" + rev;
            }
            else 
            {
                return null;
            }

            var delete_report_curl = new cURL ("DELETE", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            var check_document_curl = new cURL ("GET", null, Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/" + case_id, null, Program.config_timer_user_name, Program.config_timer_value);

            string document_json = null;
            // check if doc exists
            try 
            {
                
                document_json = await check_document_curl.executeAsync ();
                var check_docuement_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
                IDictionary<string, object> result_dictionary = check_docuement_curl_result as IDictionary<string, object>;
                
                if
                (
                    result_dictionary != null && 
                    !mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.WriteCase, check_docuement_curl_result)
                )
                {
                    Console.Write($"unauthorized DELETE {result_dictionary["jurisdiction_id"]}: {result_dictionary["_id"]}");
                    return null;
                }
                
                
                if (result_dictionary.ContainsKey ("_rev")) 
                {
                    request_string = Program.config_couchdb_url + $"/{Program.db_prefix}mmrds/" + case_id + "?rev=" + result_dictionary ["_rev"];
                    //System.Console.WriteLine ("json\n{0}", object_string);
                }
            } 
            catch (Exception ex) 
            {
                // do nothing for now document doesn't exsist.
                System.Console.WriteLine ($"err caseController.Delete\n{ex}");
            }

            string responseFromServer = await delete_report_curl.executeAsync ();;
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);


            if(! string.IsNullOrWhiteSpace(document_json))
            {
                var Sync_Document_Message = new mmria.pmss.server.model.actor.Sync_Document_Message
                (
                    case_id,
                    document_json,
                    "DELETE"
                );

                _actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.Synchronize_Case>()).Tell(Sync_Document_Message);
                /*
                var case_sync_actor = _actorSystem.ActorSelection("akka://mmria-actor-system/user/case_sync_actor");
                case_sync_actor.Tell(Sync_Document_Message);
                */

            }
            return result;

        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return null;
    }

/*
    public async Task<IActionResult> OnGetAsync(string documentId)
    {
        Document = _documentRepository.Find(documentId);

        if (Document == null)
        {
            return new NotFoundResult();
        }

        var authorizationResult = await _authorizationService
                .AuthorizeAsync(User, Document, "EditPolicy");

        if (authorizationResult.Succeeded)
        {
            return Page();
        }
        else if (User.Identity.IsAuthenticated)
        {
            return new ForbidResult();
        }
        else
        {
            return new ChallengeResult();
        }
    } 
*/

} 

