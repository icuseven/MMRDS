
var config = null;
var config_master = null;

window.onload = main;

async function main()
{
    config = await get_config();
    config_master = await get_config_master();

    const el = document.getElementById("content");

    el.innerHTML = "<h2>View Configuration</h2>";
}

async function get_config()
{
    const url = `${location.protocol}//${location.host}/_config/GetConfiguration`;

    const result = await $.ajax
    ({
        url: url,
    });

    return result;
}

async function get_config_master()
{
    const url = `${location.protocol}//${location.host}/_config/GetConfigurationMaster`;

    const result = await $.ajax
    ({
        url: url,
    });

    return result;
}