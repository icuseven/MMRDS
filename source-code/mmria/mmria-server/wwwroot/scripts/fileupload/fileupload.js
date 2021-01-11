var g_file_stat_list = [];
var g_content_list = [];
var g_validation_errors = [];
var g_host_state = null;

var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      var output = document.getElementById('output');
      output.value = dataURL;
    };
    reader.readAsText(input.files[0]);
  };

function readmultifiles(files) 
{

    let ul_list = [];
    g_file_stat_list = [];

    for(let i = 0; i < files.length; i++)
    {
        let item = files[i];
        readFile(i);
        g_file_stat_list.push({ name: item.name, index: i })
  
    }


    function readFile(index) 
    {
        if( index >= files.length ) return;

        var file = files[index];
        var reader = new FileReader(); 
        reader.onload = function(e) {  
            // get file content  
            g_content_list[index] = e.target.result;
            // do sth with bin
            readFile(index+1)
        }
        reader.readAsText(file);

        window.setTimeout(setup_file_list, 9000);
    }
}


window.onload = function()
{
    let process_button = document.getElementById("process");
    process_button.onclick = process_button_click;
    process_button.disabled = true;
}


function process_button_click()
{
    alert("wired up");
}

function setup_file_list()
{
    g_host_state = null;

    let result = false;

    let is_mor = false;
    let is_nat = false;
    let is_fet = false;

    let temp = [];
    let temp_contents = [];

    if(g_file_stat_list.length != 3)
    {
        g_validation_errors.push("need all 3 IJE files");
    }

    for(let i = 0; i < g_file_stat_list.length; i++)
    {
        let item = g_file_stat_list[i];
        if(item.name.toLowerCase().endsWith(".mor"))
        {
            is_mor = true;
            temp[0] = item;
            temp_contents[0] = g_content_list[i];
        }
        else if(item.name.toLowerCase().endsWith(".nat"))
        {
            is_nat = true;
            temp[1] = item;
            temp_contents[1] = g_content_list[i];
        }
        else if(item.name.toLowerCase().endsWith(".fet"))
        {
            is_fet = true;
            temp[2] = item;
            temp_contents[2] = g_content_list[i];
        }
    }



    if(is_mor && is_nat && is_fet)
    {
        if
        ( !(

            get_state_from_file_name(g_file_stat_list[0].name) &&
            get_state_from_file_name(g_file_stat_list[1].name) &&
            get_state_from_file_name(g_file_stat_list[2].name)
            )

        )
        {
            g_validation_errors.push("need all 3 IJE files must have same state");
        }
        else
        {
            g_host_state = get_state_from_file_name(g_file_stat_list[0].name);
        }
        

    }
    else
    {
        g_validation_errors.push("need all 3 IJE files");
    }

    if(!is_mor)
    {
        g_validation_errors.push("missing .MOR IJE file")
    }

    if(!is_nat)
    {
        g_validation_errors.push("missing .NAT IJE file")
    }

    if(!is_fet)
    {
        g_validation_errors.push("missing .FET IJE file")
    }



    g_file_stat_list = temp;
    g_content_list = temp_contents;

    render_file_list()

    return result;
  
}


function get_state_from_file_name(p_val)
{
    if(p_val.length > 15)
    {
        return p_val.substr(11, p_val.length - 15);
    }
    else
    {
        return p_val;
    }
}


function render_file_list()
{
    let bag = document.getElementById('bag');

    let ul_list = [];
    ul_list.push("<ul>");
    for(let i = 0; i < g_file_stat_list.length; i++)
    {
        let item = g_file_stat_list[i];
        let number_of_lines = 0;

        if(g_content_list.length > i && g_content_list[i])
        {
            let lines = g_content_list[i].split('\n');
            number_of_lines = lines.length;
        }

        if(item.name.toLowerCase().endsWith(".mor"))
        {
            let out = document.getElementById('mor_output')
            out.value = g_content_list[i];
        }
        else if(item.name.toLowerCase().endsWith(".nat"))
        {
            let out = document.getElementById('nat_output')
            out.value = g_content_list[i];
        }
        else if(item.name.toLowerCase().endsWith(".fet"))
        {
            let out = document.getElementById('fet_output')
            out.value = g_content_list[i];
        }

        ul_list.push("<li>");
        ul_list.push(item.name);
        ul_list.push(" number of records ");
        ul_list.push(" (");
        ul_list.push(number_of_lines);
        ul_list.push(")</li>");
    }
    ul_list.push("</ul>");

    bag.innerHTML = ul_list.join("");

    let out = document.getElementById('output');
    let button = document.getElementById('process');
    if(g_validation_errors.length > 0)
    {
       out.value = g_validation_errors.join("\n");
       button.disabled = true;
    }
    else
    {
        out.value = g_host_state + " ready to process";
        button.disabled = false;
    }
}