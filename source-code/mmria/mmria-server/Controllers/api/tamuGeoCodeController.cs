using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using mmria.common.model;

namespace mmria.server;

[Authorize]
[Route("api/[controller]")]
public sealed class tamuGeoCodeController: ControllerBase 
{ 
    IConfiguration configuration;
    mmria.common.couchdb.ConfigurationSet ConfigDB;
    public tamuGeoCodeController(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
    {
        configuration = p_configuration;
        ConfigDB = p_config_db;
    }
    
    [Authorize(Roles  = "abstractor")]
    [HttpGet]
    public async Task<mmria.common.texas_am.geocode_response> Get
    (
        string street_address,
        string city,
        string state,
        string zip
    ) 
    { 

            var result = new common.texas_am.geocode_response();

            string geocode_api_key = ConfigDB.name_value["geocode_api_key"];
            //string geocode_api_url = configuration["mmria_settings:geocode_api_url"];

            string request_string = string.Format ($"https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={street_address}&city={city}&state={state}&zip={zip}&apikey={geocode_api_key}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01");

            var curl = new mmria.getset.cURL("GET", null, request_string, null);
            try
            {
                string responseFromServer = await curl.executeAsync();

                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.texas_am.geocode_response>(responseFromServer);
            
            }
            catch(Exception)// ex)
            {
                // do nothing for now
            }

            return result;
    }

    


    private class TAMUGeoCode
    {

        public mmria.common.texas_am.geocode_response execute
        (
            string geocode_api_key,
            string street_address,
            string city,
            string state,
            string zip
        ) 
        { 

            var result = new common.texas_am.geocode_response();

            string request_string = string.Format ("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={0}&city={1}&state={2}&zip={3}&apikey={4}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01", street_address, city, state, zip, geocode_api_key);

            var curl = new mmria.getset.cURL("GET", null, request_string, null);
            try
            {
                string responseFromServer = curl.execute();

                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.texas_am.geocode_response>(responseFromServer);
            
            }
            catch(Exception)// ex)
            {
                // do nothing for now
            }

            return result;

        } 


        public async Task<IEnumerable<mmria.common.texas_am.geocode_response>> executeAsync
        (
            string geocode_api_key,
            string street_address,
            string city,
            string state,
            string zip
        ) 
        { 
            
            string request_string = string.Format ("https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress={0}&city={1}&state={2}&zip={3}&apikey={4}&format=json&allowTies=false&tieBreakingStrategy=flipACoin&includeHeader=true&census=true&censusYear=2000|2010&notStore=false&version=4.01", street_address, city, state, zip, geocode_api_key);

            var curl = new mmria.getset.cURL("GET", null, request_string, null);
                        // Read the content.
            string responseFromServer = await curl.executeAsync();

            var json_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.texas_am.geocode_response>(responseFromServer);



            var result =  new mmria.common.texas_am.geocode_response[] 
            { 
                json_result

            }; 

            return result;
        } 
    }

} 

