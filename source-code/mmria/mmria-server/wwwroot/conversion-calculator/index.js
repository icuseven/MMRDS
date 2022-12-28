function converter_calculater_dialog_click()
{
    window.close();
}

let cm_input = null;
let in_input = null;

let m_input = null;
let ft_input = null;

let lbs_input = null;
let kg_input = null;

let oz_input = null;
let g_input = null;

let f_input = null;
let c_input = null;

let reset_input = null;
let convert_input = null;


function main()
{
    console.log("here");


    cm_input = document.getElementById("cm");
    in_input = document.getElementById("in");
    m_input = document.getElementById("m");
    ft_input = document.getElementById("ft");
    lbs_input = document.getElementById("lbs");
    kg_input = document.getElementById("kg");
    oz_input = document.getElementById("oz");
    g_input = document.getElementById("g");
    f_input = document.getElementById("f");
    c_input = document.getElementById("c");
    reset_input = document.getElementById("reset");

    convert_input= document.getElementById("convert")
    convert_input.disabled = true;
}



function reset_clicked()
{

    cm_input.value = "";
    in_input.value = "";
    m_input.value = "";
    ft_input.value = "";
    lbs_input.value = "";
    kg_input.value = "";
    oz_input.value = "";
    g_input.value = "";
    f_input.value = "";
    c_input.value = "";
    
    render_convert();
}


function render_convert()
{
    let is_able_to_convert = false;

    is_able_to_convert = is_able_to_convert || (cm_input.value != null && cm_input.value != '');
    is_able_to_convert = is_able_to_convert || (in_input.value != null && in_input.value != '');
    is_able_to_convert = is_able_to_convert || (m_input.value != null && m_input.value != '');
    is_able_to_convert = is_able_to_convert || (ft_input.value != null && ft_input.value != '');
    is_able_to_convert = is_able_to_convert || (lbs_input.value != null && lbs_input.value != '');
    is_able_to_convert = is_able_to_convert || (kg_input.value != null && kg_input.value != '');
    is_able_to_convert = is_able_to_convert || (kg_input.value != null && kg_input.value != '');
    is_able_to_convert = is_able_to_convert || (g_input.value != null && g_input.value != '');
    is_able_to_convert = is_able_to_convert || (f_input.value != null && f_input.value != '');
    is_able_to_convert = is_able_to_convert || (c_input.value != null && c_input.value != '');

    if(is_able_to_convert)
    {
        convert_input.disabled = false;
    }
    else
    {
        convert_input.disabled = true;
    }
    
}

function convert_clicked()
{

    /*
    cm_input.value = "";
    in_input.value = "";
    m_input.value = "";
    ft_input.value = "";
    lbs_input.value = "";
    kg_input.value = "";
    oz_input.value = "";
    g_input.value = "";
    f_input.value = "";
    c_input.value = "";
    */
    
    render_convert();
}
