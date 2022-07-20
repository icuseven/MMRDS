var g_lat = null;
var g_lon  = null;
var g_year = null;
var g_record_id = null;
var output_element = null;
var report_log = [];

const bc = new BroadcastChannel('cvs_channel');
bc.onmessage = (message_data) => {

g_lat = message_data.data.lat;
g_lon  = message_data.data.lon;
g_year = message_data.data.year;
g_record_id = message_data.data.record_id

    pre_render(message_data.data);
}

async function main()
{
    g_lat = document.getElementById("lat").value;
    g_lon = document.getElementById("lon").value;
    g_year = document.getElementById("year").value;
    g_record_id = document.getElementById("id").value;

    const report_output_element = document.getElementById("report_output_id");
    const spinner = document.getElementById("spinner-id");
    const header = document.getElementById("header");
    const el = document.getElementById("output");

    let is_finished = false;

    while(! is_finished)
    {
        report_log.push(`calling community vital signs service @ ${new Date()}`)
        report_output_element.innerHTML = `<hr/><br/><pre>${report_log.join("\n\n")}</pre>`;
        const response = await get_cvs_api_dashboard_info
        (
            g_lat,
            g_lon,
            g_year,
            g_record_id
        )


        if(response.file_status != null)
        {
            report_log.push(`file_status: ${response.file_status} @ ${new Date()}`);
            if(response.file_status == "file ready")
            {
                spinner.innerHTML = `${render_close_button_html()}&nbsp;${render_download_button_html()}`;

                is_finished = true;
            }
            else if(response.file_status == "error")
            {
                //console.log(response);

                header.innerHTML = "Error: Community Vital Sign PDF";
                el.innerHTML = "PDF cannot be generated. External Community Vital Signs Server is unavailable. Please try again later.";
                spinner.innerHTML = render_close_button_html();
                is_finished = true;
                //$mmria.info_dialog_show("Community Vital Sign PDF","An error occured  when calling the Community Vital Signs. Please try again later.");
            }
            else if(response.file_status == "generating")
            {
                //console.log(response);
            }
            else
            {
                header.innerHTML = "Error: Community Vital Sign PDF";
                el.innerHTML = "PDF cannot be generated. External Community Vital Signs Server is unavailable. Please try again later.";
                spinner.innerHTML = render_close_button_html();
                is_finished = true;
            }
        }
        else
        {
            header.innerHTML = "Error: Community Vital Sign PDF";
            el.innerHTML = "PDF cannot be generated. External Community Vital Signs Server is unavailable. Please try again later.";

            spinner.innerHTML = render_close_button_html();
            report_log.push(`CVS reponse Status Code: ${response.status} @ ${new Date()}`);
            is_finished = true;
        }

        report_output_element.innerHTML = `<hr/><br/><pre>${report_log.join("\n\n")}</pre>`;
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
    //http://localhost:12345/api/cvsAPI/GA-2012-1234

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


function render_close_button_html()
{
    return `<input id="close_button" type="button" value="Close this tab" onclick="window.close();" />`
}

function render_download_button_html()
{
    return `<input id="download_button" type="button" value="Close" onclick="download_button_click()" />`
}


function download_button_click()
{
    var pdf_url = `${location.protocol}//${location.host}/api/cvsAPI/${g_record_id}`

    document.body.innerHTML = `<embed src="${pdf_url}" type="application/pdf"
    frameBorder="0"
    scrolling="auto"
    height="300px"
    width="100%" />`
}