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
    is_able_to_convert = is_able_to_convert || (oz_input.value != null && oz_input.value != '');
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



    if(cm_input.value != null && cm_input.value != '')
    {
        in_input.value = cm_to_in(cm_input.value);
    }
    else if(in_input.value != null && in_input.value != '')
    {
        cm_input.value = in_to_cm(in_input.value);
    }

    if(m_input.value != null && m_input.value != '')
    {
        ft_input.value = m_to_ft(m_input.value);
    }
    else if(ft_input.value != null && ft_input.value != '')
    {
        m_input.value = ft_to_m(f_input.value);
    }

    if(lbs_input.value != null && lbs_input.value != '')
    {
        kg_input.value = lbs_to_kg(lbs_input.value);
    }
    else if(kg_input.value != null && kg_input.value != '')
    {
        lbs_input.value = kg_to_lbs(kg_input.value);
    }

    if(oz_input.value != null && oz_input.value != '')
    {
        g_input.value = oz_to_g(kg_input.value);
    }
    else if(g_input.value != null && g_input.value != '')
    {
        oz_input.value = g_to_oz(g_input.value);
    }

    if(f_input.value != null && f_input.value != '')
    {
        c_input.value = f_to_c(f.value);
    }
    else if(c_input.value != null && c_input.value != '')
    {
        f_input.value = c_to_f(f_input.value);
    }
    
    render_convert();
}

function cm_to_in(p_value)
{
    return p_value  * 0.3937007874;
    //cm_input.value = "";
    //in_input.value = "";
}
function in_to_cm(p_value)
{
    return p_value * 2.54;
    //cm_input.value = "";
    //in_input.value = "";
}



function m_to_ft(p_value)
{
    return p_value * 3.28084;
    // m_input.value = "";
    //ft_input.value = "";
}
function ft_to_m(p_value)
{
    return p_value * 0.3048;
    //m_input.value = "";
    //ft_input.value = "";
}



function lbs_to_kg(p_value)
{
    return p_value * 0.4535924;
    //lbs_input.value = "";
    //kg_input.value = "";
}
function kg_to_lbs(p_value)
{
    return p_value * 2.204623;
    //lbs_input.value = "";
    //kg_input.value = "";
}





function oz_to_g(p_value)
{
    return p_value * 28.34952;
    //oz_input.value = "";
    //g_input.value = "";

}
function g_to_oz(p_value)
{
    return p_value * 0.03527396;
    //oz_input.value = "";
    //g_input.value = "";

}



function f_to_c(p_value)
{
    return (p_value - 32) / 1.8000
    //f_input.value = "";
    //c_input.value = "";
}
function c_to_f(p_value)
{
    return p_value * 1.8000 + 32
    //f_input.value = "";
    //c_input.value = ""; 
}
