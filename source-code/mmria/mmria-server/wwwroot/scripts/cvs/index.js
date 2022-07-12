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

{
    "statusCode": 200,
    "headers": {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
    "body": "\"PDF creation has been initiated and should be ready shortly. Please retry API call\""
}


{
    "statusCode": 200,
    "body": "\"PDF is being created!\""
}


{
    "statusCode": 200,
    "headers": {
        "Content-type": "application/pdf"
    },
    "body": "JVBERi0xLjQKJazcIKu6CjEgMCBvYmoKPDwgL1BhZ2VzIDIgMCBSIC9UeXBlIC9DYXRhbG9nID4YXRlRGVjb2RlIC9MZW5 [TRUNCATED]",
    "isBase64Encoded": true
}



*/


    pre_render(message_data.data);
}

async function main()
{
    g_lat = document.getElementById("lat").value;
    g_lon = document.getElementById("lon").value;
    g_year = document.getElementById("year").value;
    g_record_id = document.getElementById("id").value

    let is_finished = false;

    while(! is_finished)
    {
        const response = await get_cvs_api_dashboard_info
        (
            g_lat,
            g_lon,
            g_year,
            g_record_id
        )


        if(response.file_status != null)
        {
            if(response.file_status == "file ready")
            {
                //console.log(response.body);
                var pdf_url = `${location.protocol}//${location.host}/api/cvsAPI/${g_record_id}`

                document.body.innerHTML = `<embed src="${pdf_url}" type="application/pdf"
                frameBorder="0"
                scrolling="auto"
                height="300px"
                width="100%" />`

                is_finished = true;
            }
            else if(response.file_status == "error")
            {
                //console.log(response);
                const header = document.getElementById("header");
                const el = document.getElementById("output");
                header.innerHTML = "Community Vital Sign PDF";
                el.innerHTML = " An error occured  when calling the Community Vital Signs. Please try again later.";

                is_finished = true;
                //$mmria.info_dialog_show("Community Vital Sign PDF","An error occured  when calling the Community Vital Signs. Please try again later.");
            }
            else if(response.file_status == "generating")
            {
                //console.log(response);
            }
            else
            {
                is_finished = true;
            }
        }
        else
        {
            is_finished = true;
        }
    }
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

    
        const response = await fetch
        (
            base_url,
            {
                method: "POST",
                headers:
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
                },
                body: JSON.stringify({
                    action: "dashboard",
                    lat: lat,
                    lon: lon, 
                    year: year,
                    id: id

                }),
            }
        )

        //console.log(response);

        return response.json();
    }
    catch(ex)
    {
        return { statusCode: 500, body: ex };
    }
}


async function get_file(p_id)
{
    http://localhost:12345/api/cvsAPI/GA-2012-1234

    var base_url = `${location.protocol}//${location.host}/api/cvsAPI/${p_id}`

    try
    {

    
        const response = await fetch
        (
            base_url,
            {
                method: "GET",
                headers:
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*'
                },
            }
        )

        //console.log(response);

        return response;
    }
    catch(ex)
    {
        return { statusCode: 500, body: ex };
    }
}

async function pre_render(p_data)
{
    const output_element = document.getElementById('output');
    const report_output_element = document.getElementById('report_output_id');
}


function show_loading_modal()
{
    const el = document.getElementById("loading-modal");    
    el.innerHTML = `
    <div style="padding:50px;" class="display-6">
    <div id="form_content_id" >
    <span class="spinner-container spinner-content spinner-active">
        <span class="spinner-body text-primary">
        <span class="spinner"></span>
        <span class="spinner-info">Loading...</span>
        </span>
    </span>
    </div>
    </div>
`;

    el.showModal();
}

function close_loading_modal()
{
    const el = document.getElementById("loading-modal");
    el.close();    

}
