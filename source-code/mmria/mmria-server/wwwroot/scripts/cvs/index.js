var g_lat = null;
var g_lon  = null;
var g_year = null;
var g_record_id = null;
var output_element = null;
var report_output_element = null;

const bc = new BroadcastChannel('cvs_channel');
bc.onmessage = (message_data) => {

g_lat = message_data.data.lat;
g_lon  = message_data.data.lon;
g_year = message_data.data.year;
g_record_id = message_data.data.record_id

/*

"lat":"33.880577",
      "lon":"-84.29106", 
      "year":"2012",
      "id":"GA-2012-1234"

*/


    pre_render(message_data.data);
}

async function main()
{
    g_lat = "33.880577";
    g_lon  = "-84.29106";
    g_year = "2012";
    g_record_id = "GA-2012-1234"
}

window.onload = main;

async function get_cvs_api_dashboard_info 
(
    lat,
    lon, 
    year,
    id,
)
{            
    var base_url = `${location.protocol}//${location.host}/api/cvsAPI`

    try
    {

    
        const response = fetch
        (
            base_url,
            {
                method: "POST",
                body: JSON.stringify({
                    action: "dashboard",
                    lat: lat,
                    lon: lon, 
                    year: year,
                    id: id

                }),
            }
        )
    }
    catch(ex)
    {
        console.log(ex);
    }


}


async function pre_render(p_data)
{
    const output_element = document.getElementById('output');
    const report_output_element = document.getElementById('report_output_id');
}