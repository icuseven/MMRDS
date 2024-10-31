using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

//builder.Configuration["BaseAddress"] = builder.HostEnvironment.BaseAddress;

var configuration = builder.Configuration;


var http_client = new HttpClient();
builder.Services.AddScoped(sp => http_client );

/*
var overridable_config = await GetOverridableConfiguration
(
    new mmria.common.couchdb.DBConfigurationDetail()
    { 
        url =  configuration["mmria_settings:couchdb_url"],
        user_name = configuration["mmria_settings:timer_name"],
        user_value = configuration["mmria_settings:timer_value"]
    },
    configuration["mmria_settings:shared_config_id"],
    http_client
);


var key_set = new HashSet<string>();

foreach(var kvp in overridable_config.boolean_keys)
{
    key_set.Add(kvp.Key);
}

foreach(var kvp in overridable_config.string_keys)
{
    key_set.Add(kvp.Key);
}

foreach(var kvp in overridable_config.integer_keys)
{
    key_set.Add(kvp.Key);
}
/*

foreach(var key in key_set)
{
    Log.Information("\t" + key);
}
Log.Information("\n");
* /

overridable_config.SetString
    (
        configuration["mmria_settings:config_id"], 
        "shared_config_id", configuration["mmria_settings:shared_config_id"]
    );

builder.Services.AddSingleton<mmria.common.couchdb.OverridableConfiguration>(overridable_config);
*/


await builder.Build().RunAsync();



static async Task<mmria.common.couchdb.OverridableConfiguration> GetOverridableConfiguration
(
    mmria.common.couchdb.DBConfigurationDetail configuration,
    string shared_config_id,
    HttpClient http_client
)
{
    var result = new mmria.common.couchdb.OverridableConfiguration();
    try
    {
        string request_string = $"{configuration.url}/configuration/{shared_config_id}";
        //var case_curl = new mmria.server.cURL("GET", null, request_string, null, configuration.user_name, configuration.user_value);
        //string responseFromServer = case_curl.execute();
        //System.Console.WriteLine(responseFromServer);
        result = await GetFromAPI<mmria.common.couchdb.OverridableConfiguration> (request_string, http_client);
    }
    catch(Exception ex)
    {
        Console.WriteLine (ex);
    } 

    return result;
}

    static async Task<T> GetFromAPI<T>
    (
        string url,
        HttpClient http_client
    )
    {
            var result = default(T);

            try
            {
               
                //http_client.DefaultRequestHeaders.Accept
                //    .Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                var response = await http_client.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();

                result = System.Text.Json.JsonSerializer.Deserialize<T>(json);

                //result_text = $"{json} \n\nThe user:\n{user.name} {user._id}\nNavigationManager: {base_url}\nBaseAddress: {config["BaseAddress"]} \nmmria_settings:couchdb_url = {config["mmria_settings:couchdb_url"]}";
        
            }
            catch(System.Exception ex)
            {

            }

            return result;
    }