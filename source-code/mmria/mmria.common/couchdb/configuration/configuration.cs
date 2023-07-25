using System;
using System.Collections.Generic;

namespace mmria.common.couchdb;

public sealed class DBConfigurationDetail
{
    public string prefix { get; set;}
    public string url { get; set; }

    public string user_name { get; set; }

    public string user_value { get; set; }

}
public sealed class ConfigurationSet
{
    public ConfigurationSet()
    {
        detail_list = new Dictionary<string, DBConfigurationDetail>(StringComparer.OrdinalIgnoreCase);
        name_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }
    public string _id { get; set;}
    public string _rev { get; set; }
    public string service_key {get; set; }

    public string data_type { get; } = "configuration-set";

    public Dictionary<string, string> name_value { get;set; }

    public Dictionary<string, DBConfigurationDetail> detail_list { get;set; }

    public DateTime date_created { get; set; } 
    public string created_by { get; set; } 
    public DateTime date_last_updated { get; set; } 
    public string last_updated_by { get; set; } 

}

public sealed class Configuration
{
    public Configuration()
    {
        detail_list = new Dictionary<string, DBConfigurationDetail>(StringComparer.OrdinalIgnoreCase);
        name_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }

    public static string g_geocode_api_key;
    public static string geocode_api_url;
    public static string couchdb_url = "http://localhost:5984";

    public static string db_prefix = "";
    public static string web_site_url;

    public static string timer_user_name;
    public static string timer_value;
    public static string cron_schedule;
    public static string export_directory;

    public static bool is_schedule_enabled = true;
    public static int session_idle_timeout_minutes;

    public static bool is_db_check_enabled = false;

    public static string vitals_url;

    public Dictionary<string, string> name_value { get;set; }

    public Dictionary<string, DBConfigurationDetail> detail_list { get;set; }
}

public sealed class ConfigurationMaster
{
    public ConfigurationMaster()
    {
        name_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        //configuration_set = new Dictionary<string, Configuration>(StringComparer.OrdinalIgnoreCase);
        boolean_keys = new Dictionary<string, Dictionary<string, bool>>(StringComparer.OrdinalIgnoreCase);
        string_keys = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);
        integer_keys = new Dictionary<string, Dictionary<string, int>>(StringComparer.OrdinalIgnoreCase);
        
        /*
        boolean_keys.Add("shared", new Dictionary<string, bool>(StringComparer.OrdinalIgnoreCase));
        string_keys.Add("shared", new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase));
        integer_keys.Add("shared", new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase));
    
    
        string_keys["shared"].Add("geocode_api_key", "");
        string_keys["shared"].Add("geocode_api_url", "");
        string_keys["shared"].Add("couchdb_url", "http://localhost:5984");
        string_keys["shared"].Add("db_prefix", "");
        string_keys["shared"].Add("web_site_url", "http://*:8080");
        string_keys["shared"].Add("timer_user_name", "");
        string_keys["shared"].Add("timer_value", "");
        string_keys["shared"].Add("cron_schedule", "0 * /1 * * * ?");

        string_keys["shared"].Add("log_directory", "/home/net_core_user/app/workdir/mmria-log");
        string_keys["shared"].Add("export_directory", "/home/net_core_user/app/workdir/mmria-export");
        string_keys["shared"].Add("metadata_version", "23.05.30");
        string_keys["shared"].Add("vitals_url", "http://mmria-services:8080/api/Message/IJESet");
        string_keys["shared"].Add("vitals_service_key", "");
        string_keys["shared"].Add("app_instance_name", "");


        string_keys["shared"].Add("cvs_api_id", "");
        string_keys["shared"].Add("cvs_api_key", "");
        string_keys["shared"].Add("cvs_api_url", "");

        string_keys["shared"].Add("steve_api:sea_bucket_kms_key", "");
        string_keys["shared"].Add("steve_api:client_name", "");
        string_keys["shared"].Add("steve_api:client_secreat_key", "");
        string_keys["shared"].Add("steve_api:base_url", "");
        string_keys["shared"].Add("exclude_from_broadcast_list","");

        string_keys["shared"].Add("sams:direct_login_url", "");
        string_keys["shared"].Add("sams:endpoint_authorization","");
        string_keys["shared"].Add("sams:endpoint_token","");
        string_keys["shared"].Add("sams:endpoint_user_info","");
        string_keys["shared"].Add("sams:endpoint_token_validation","");
        string_keys["shared"].Add("sams:endpoint_user_info_sys","");
        string_keys["shared"].Add("sams:client_id","");
        string_keys["shared"].Add("sams:client_secret","");
        string_keys["shared"].Add("sams:callback_url","");
        string_keys["shared"].Add("sams:logout_url", "");
        string_keys["shared"].Add("sams:activity_name", "");



        boolean_keys["shared"].Add("is_schedule_enabled ", true);
        boolean_keys["shared"].Add("is_db_check_enabled", false);
        boolean_keys["shared"].Add("is_environment_based", true);
        boolean_keys["shared"].Add("is_development", false);
        boolean_keys["shared"].Add("use_development_settings", false);
        boolean_keys["shared"].Add("sams:is_enabled", false);


        integer_keys["shared"].Add("session_idle_timeout_minutes", 70);
        integer_keys["shared"].Add("pass_word_minimum_length", 8);
        integer_keys["shared"].Add("pass_word_days_before_expires", 0);
        integer_keys["shared"].Add("pass_word_days_before_user_is_notified_of_expiration", 0);
        integer_keys["shared"].Add("default_days_in_effective_date_interval", 0);
        integer_keys["shared"].Add("unsuccessful_login_attempts_number_before_lockout", 5);
        integer_keys["shared"].Add("unsuccessful_login_attempts_within_number_of_minutes", 120);
        integer_keys["shared"].Add("unsuccessful_login_attempts_lockout_number_of_minutes", 15);
        */




    }
    public string _id { get; set;}
    public string _rev { get; set; }

    public DateTime date_created { get; set; } 
    public string created_by { get; set; } 
    public DateTime date_last_updated { get; set; } 
    public string last_updated_by { get; set; } 

    public string data_type { get; } = "configuration-master";

    public Dictionary<string, string> name_value { get;set; }

    //public Dictionary<string, Configuration> configuration_set { get; set; }


    public Dictionary<string, Dictionary<string, bool>> boolean_keys { get;set; }
    public Dictionary<string, Dictionary<string, string>> string_keys { get;set; }
    public Dictionary<string, Dictionary<string, int>> integer_keys { get;set; }
    public bool? GetBoolean(string key, string prefix = "shared")
    {
        if(boolean_keys.ContainsKey(key))
        {
            if(boolean_keys[key].ContainsKey(prefix))
            {
                return boolean_keys[key][prefix];
            }
            else if(boolean_keys[key].ContainsKey("shared")) return boolean_keys[key]["shared"];
        }

        return null;
    }

    public string GetString(string key, string prefix = "shared")
    {
        if(string_keys.ContainsKey(key))
        {
            if(string_keys[key].ContainsKey(prefix))
            {
                return string_keys[key][prefix];
            }
            else if(string_keys[key].ContainsKey("shared")) return string_keys[key]["shared"];
        }

        return null;
    }
    
    public int? GetInteger(string key, string prefix = "shared")
    {
        if(integer_keys.ContainsKey(key))
        {
            if(integer_keys[key].ContainsKey(prefix))
            {
                return integer_keys[key][prefix];
            }
            else if(integer_keys[key].ContainsKey("shared")) return integer_keys[key]["shared"];
        }
    
        return null;
    }
    
}
