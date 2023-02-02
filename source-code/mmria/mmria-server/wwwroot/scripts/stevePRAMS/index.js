let BeginDateControl = null;
let EndDateControl = null;
let MailboxControl = null;
let StartDownloadButton = null;
let RefreshButton = null;
let queue_result = null;

let begin_date = new Date();
let end_date = new Date();
let Mailbox = null;


window.onload = main;

async function main()
{
    BeginDateControl = document.getElementById("BeginDate");
    EndDateControl = document.getElementById("EndDate");
    MailboxControl = document.getElementById("Mailbox");
    StartDownloadButton = document.getElementById("StartDownloadButton");
    RefreshButton = document.getElementById("Refresh");

    queue_result = document.getElementById("queue_result");

    BeginDateControl.onchange = ()=> begin_date_change(BeginDateControl.value);
    EndDateControl.onchange = ()=> end_date_change(EndDateControl.value);
    MailboxControl.onchange = ()=> mailbox_change(MailboxControl.value);

    StartDownloadButton.onclick = ()=> download_click();

    begin_date_change(BeginDateControl.value);
    end_date_change(EndDateControl.value);

    var q = await get_queue_result_list();
    const html = [];
        
    html.push(`
        <table>
        
        <tr>
        <th>createdBy</th>
        <th>dateCreated</th>
        <th>dateLastUpdated</th>
        <th>exportType</th>
        <th>fileName</th>
        <th>lastUpdatedBy</th>
        <th>status</th>
        </tr>
    
    `);

    for(const i in q.items)
    {
        html.push(`
        <tr>
        <td>${q.items[i].createdBy}</td>
        <td>${q.items[i].dateCreated}</td>
        <td>${q.items[i].dateLastUpdated}</td>
        <td>${q.items[i].exportType}</td>
        <td>${q.items[i].fileName}</td>
        <td>${q.items[i].lastUpdatedBy}</td>
        <td>${q.items[i].status}</td>
        </tr>
        `);
    }

    html.push("</table>");

    queue_result.innerHTML = html.join("");
    //console.log(q);    
    
}

function mailbox_change(p_value)
{
     Mailbox = p_value;
}


function begin_date_change(p_value)
{
    const arr = p_value.split("-");
    
    let date_changed = arr[0] >= 1900 ? false :true;

    let test_date = new Date(arr[0] > 1900 ? arr[0] : 1900, arr[1] - 1, arr[2]);

    if(arr[0] < 1900)
    {
        test_date = new Date(1900 , 0, 1);
    }

    const current_date = new Date();

    if(test_date <= current_date && test_date <= end_date)
    {
        begin_date = test_date;
  
        EndDateControl.setAttribute("min", p_value);

        if(date_changed)
        {
            EndDateControl.setAttribute("min", ControlFormatDate(test_date));


            BeginDateControl.value = ControlFormatDate(begin_date);
        }
    }
    else
    {

        BeginDateControl.value = ControlFormatDate(gbegin_date);
    }
}

function end_date_change(p_value)
{
    const arr = p_value.split("-");
    
    let date_changed = arr[0] >= 1900 ? false :true;

    let test_date = new Date(arr[0] > 1900 ? arr[0] : 1900, arr[1] - 1, arr[2]);

    if(arr[0] < 1900)
    {
        test_date = new Date(1900 , 0, 1);
    }

    const current_date = new Date();

    if(test_date <= current_date && begin_date <=  test_date)
    {
        end_date = test_date;
      
        BeginDateControl.setAttribute("max", p_value);

        if(date_changed)
        {
            BeginDateControl.setAttribute("max", ControlFormatDate(test_date));

            EndDateControl.value = ControlFormatDate(end_date);
        }
    }
    else
    {

        EndDateControl.value = ControlFormatDate(end_date);
    }
}

function pad_number(n) 
{
    n = n + '';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join("0") + n;
}

function formatDate(p_value)
{
    const result= pad_number(p_value.getMonth() + 1) + '/' + pad_number(p_value.getDate()) + '/' +  p_value.getFullYear();

    return result;
}

function ControlFormatDate(p_value)
{
    const result= p_value.getFullYear() + '-' + pad_number(p_value.getMonth() + 1) + '-' + pad_number(p_value.getDate());

    return result;
}


async function get_queue_result_list()
{
    const get_data_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/stevePRAMS/GetQueueResult`
    });

    return get_data_response;
}

async function download_click()
{
    if
    (
        Mailbox != null &&
        Mailbox.toLowerCase() != "(select value)"
    )
    {
        const request = {
            BeginDate: begin_date.toISOString(),
            EndDate: end_date.toISOString(),
            Mailbox: Mailbox
        };

        const response = await $.ajax
        ({
            url: `${location.protocol}//${location.host}/stevePRAMS/SetDownloadRequest`,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(request),
            type: 'POST',
        });

        console.log(response);
    }
}