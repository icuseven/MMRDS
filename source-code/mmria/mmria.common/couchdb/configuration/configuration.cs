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
        this.detail_list = new Dictionary<string, DBConfigurationDetail>(StringComparer.OrdinalIgnoreCase);
        this.name_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }
    public string _id { get; set;}
    public string _rev { get; set; }
    public string service_key {get; set; }

    public string data_type { get; } = "configuration-set";

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

    public DateTime date_created { get; set; } 
    public string created_by { get; set; } 
    public DateTime date_last_updated { get; set; } 
    public string last_updated_by { get; set; } 

}

public sealed class ConfigurationMaster
{
    public ConfigurationMaster()
    {
        ConfigurationSet = new Dictionary<string, ConfigurationSet>(StringComparer.OrdinalIgnoreCase);
    }

    public Dictionary<string, ConfigurationSet> ConfigurationSet { get; set; }
}
