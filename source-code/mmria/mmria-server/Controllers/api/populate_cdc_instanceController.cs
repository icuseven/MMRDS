using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers;

[Route("api/[controller]")]
public sealed class populate_cdc_instanceController : ControllerBase
{

    IConfiguration configuration;
    mmria.common.couchdb.ConfigurationSet ConfigDB;

    public populate_cdc_instanceController(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
    {
        configuration = p_configuration;
        ConfigDB = p_config_db;
    }

    [Authorize(Roles = "cdc_admin")]
    [HttpGet]
    public async Task<mmria.common.metadata.Populate_CDC_Instance> Get()
    {
        mmria.common.metadata.Populate_CDC_Instance result = new();
        try
        {
            string request_string = $"{Program.config_couchdb_url}/metadata/populate-cdc-instance";
            var case_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = await case_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.Populate_CDC_Instance>(responseFromServer);


            var service_response = await GetFromService();  

            if
            (
                service_response != null &&
                !string.IsNullOrWhiteSpace(service_response.transfer_result)
            )
            {
                result.transfer_result = service_response.transfer_result;
                result.transfer_status_number = service_response.transfer_status_number;
                result.date_submitted = service_response.date_submitted;
                result.date_completed = service_response.date_completed;
                result.duration_in_hours = service_response.duration_in_hours;
                result.duration_in_minutes = service_response.duration_in_minutes;
            }

            Console.WriteLine("here");      
                
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return result;
    }


    public async System.Threading.Tasks.Task<mmria.common.metadata.Populate_CDC_Instance_Record> GetFromService() 
    { 
        string object_string = null;
        mmria.common.metadata.Populate_CDC_Instance_Record result = null;

        try
        {

            //var localUrl = "https://localhost:44331/api/Message/IJESet";
            //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
            //var messge_curl_result = await message_curl.executeAsync();

            string user_db_url = configuration["mmria_settings:vitals_url"].Replace("Message/IJESet", "PopulateCDCInstance");

            var user_curl = new cURL("GET", null, user_db_url, object_string);
            user_curl.AddHeader("vital-service-key", ConfigDB.name_value["vital_service_key"]);
            var responseFromServer = await user_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.Populate_CDC_Instance_Record>(responseFromServer);

        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
            result = new common.metadata.Populate_CDC_Instance_Record()
            {
                transfer_status_number = 2,
                transfer_result = ex.Message
            };
            
        }

        return result;
    } 



    [Authorize(Roles = "cdc_admin")]

    [HttpPost]
    public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
    (

    //mmria.common.metadata.Add_Attachement add_attachement
    )
    {
        string document_content;
        mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response();

        try
        {
        System.IO.Stream dataStream0 = this.Request.Body;
        //dataStream0.Seek(0, System.IO.SeekOrigin.Begin);
        System.IO.StreamReader reader0 = new System.IO.StreamReader(dataStream0);

        document_content = await reader0.ReadToEndAsync();

        mmria.common.metadata.Populate_CDC_Instance populate_cdc_instance = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.Populate_CDC_Instance>(document_content);

        if(populate_cdc_instance._id == "populate-cdc-instance")
        {
            string url = $"{Program.config_couchdb_url}/metadata/populate-cdc-instance";
            //System.Console.WriteLine ("json\n{0}", object_string);

            cURL put_document_curl = new cURL("PUT", null, url, document_content, Program.config_timer_user_name, Program.config_timer_value);

            //bool save_document = false;


            try
            {
            string responseFromServer = await put_document_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);


            }
            catch (Exception ex)
            {
            Console.WriteLine(ex);
            }
        }

        if (!result.ok)
        {

        }

        }
        catch (Exception ex)
        {
        Console.WriteLine(ex);
        }

        return result;
    }

    [Authorize(Roles  = "cdc_admin")]
    [HttpPut]
    public async System.Threading.Tasks.Task<mmria.common.metadata.Populate_CDC_Instance> Post([FromBody] mmria.common.metadata.Populate_CDC_Instance request_message) 
    { 
        string object_string = null;
        mmria.common.metadata.Populate_CDC_Instance result = new ();

        try
        {
            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            object_string = Newtonsoft.Json.JsonConvert.SerializeObject(request_message, settings);

                //var localUrl = "https://localhost:44331/api/Message/IJESet";
                //var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                //var messge_curl_result = await message_curl.executeAsync();

            string user_db_url = configuration["mmria_settings:vitals_url"].Replace("Message/IJESet", "PopulateCDCInstance");

            var user_curl = new cURL("PUT", null, user_db_url, object_string);
            user_curl.AddHeader("vital-service-key", ConfigDB.name_value["vital_service_key"]);
            var responseFromServer = await user_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.Populate_CDC_Instance>(responseFromServer);

        }
        catch(Exception ex) 
        {
            Console.WriteLine (ex);
            result.transfer_result = ex.Message;
            
        }

        return result;
    } 


    private mmria.common.couchdb.ConfigurationSet GetConfiguration()
    {
        var result = new mmria.common.couchdb.ConfigurationSet();
        try
        {
            string request_string = $"{Program.config_couchdb_url}/configuration/{Program.config_id}";
            var case_curl = new mmria.server.cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = case_curl.execute();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.couchdb.ConfigurationSet> (responseFromServer);

        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return result;
    }


    public static string Base64Decode(string base64EncodedData)
    {
        var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
        return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    }

}

