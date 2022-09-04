
const view_model = {

    search_text: "",
    search_results: [],
    selected_id: "",
    selected_jurisdiction: "",
    selected_revision_result: null,
    selected_revision_result_index: -1
};



window.onload = main;


async function main()
{
    await render();
}


async function render()
{
    const el = document.getElementById("output")
    

    if
    (
        view_model.selected_id != null &&
        view_model.selected_id != ""
    )
    {
        el.innerHTML = render_search_ui() +
        render_versions_for_selected_id();
    }
    else
    {
        el.innerHTML = render_search_ui();
    }
}

function render_search_ui()
{

    const jurisdiction_html_builder = [];
    jurisdiction_html_builder.push("<p>Select Jurisdition</p>\n<select onchange=\"juridiction_changed(this.value)\">");

    jurisdiction_html_builder.push(`<option value="" selected>Select a Jurisdition</option>`);
    for(const i in g_jurisdiction_list)
    {
        const item = g_jurisdiction_list[i];
        if(item == view_model.selected_jurisdiction)
        {
            jurisdiction_html_builder.push(`
            <option value="${item}" selected>${item}</option>
            `);
        }
        else
        {
            jurisdiction_html_builder.push(`
            <option value="${item}">${item}</option>
            `);
        }
    }
    jurisdiction_html_builder.push("</select>");

    let result = [];
    if
    (
        view_model.search_results != null &&
        view_model.search_results.rows != null &&
        view_model.search_results.rows.length != 0
    )
    {
        for(const row in view_model.search_results.rows)
        {
            const detail = view_model.search_results.rows[row].value;
            const id = view_model.search_results.rows[row].id;

            result.push(`
            <li>
                <input type="button" onclick="show_versions_for_id_click('${id}')" value="show versions" />
                ${detail.last_name}, ${detail.first_name} ${detail.record_id}
                created: ${detail.date_created} ${detail.created_by}<br/>
                last updated: ${detail.date_last_updated} ${detail.last_updated_by}
            </li>
            `);
        }
    }
    else if
    (
        view_model.search_text != null &&
        view_model.search_text.length != 0
    )
    {
        result.push(`<li>No record_id matches found for search text: ${view_model.search_text}`);
    }

    return `
    ${jurisdiction_html_builder.join("")}
    <p>Enter Record Id:
    <input id="search_text"
        value="${view_model.search_text}" />
    <input type="button" onclick="search_text_click()" value="Search" />
    
    <ul>
        ${result.join("")}
    </ul>

    `;
}

async function juridiction_changed(p_value)
{
    view_model.selected_jurisdiction = p_value;
}

async function search_text_click()
{
    const search_text = document.getElementById("search_text").value;
    
    view_model.selected_id = "";
    view_model.search_results = [];
    view_model.selected_revision_result = null;
    view_model.selected_revision_result_index = -1;

    view_model.search_text = search_text;
    view_model.search_results = await get_case_view(search_text);

    console.log(view_model.search_results);

    await render();
}


async function get_case_view(p_search_text)
{
    const result = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/caseRevisionList_case_view?jurisdiction_id=${view_model.selected_jurisdiction}&search_key=${encodeURIComponent(p_search_text)}`
    });


    
    return result;
}

async function get_case_revision_list(p_case_id)
{
    const result = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/caseRevisionList?jurisdiction_id=${view_model.selected_jurisdiction}&case_id=${p_case_id}`
    });

    return result;
}

async function get_case_revision(p_case_id, p_revision_id)
{
    const result = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/caseRevision?jurisdiction_id=${view_model.selected_jurisdiction}&case_id=${p_case_id}&revision_id=${p_revision_id}`
    });

    return result;
}



async function show_versions_for_id_click(p_id)
{
    view_model.selected_id = p_id;

    view_model.selected_revision_result = await get_case_revision_list(p_id);

    render();
}

function render_versions_for_selected_id()
{
    const result = [];

    result.push("<ol>");
    if
    (
        view_model.selected_revision_result != null &&
        view_model.selected_revision_result._revisions != null &&
        view_model.selected_revision_result._revisions.ids.length > 0
    )
    {
        const array = view_model.selected_revision_result._revisions.ids;

        let rev_start = view_model.selected_revision_result._revisions.start;
        for(var i in array)
        {
            result.push(`
                <li>
                    ${array[i]} [ <a href="${location.protocol}//${location.host}/api/caseRevision?jurisdiction_id=${view_model.selected_jurisdiction}&case_id=${view_model.selected_id}&revision_id=${rev_start}-${array[i]}" target="_blank">View</a> ]
                </li>
            `);

            rev_start -= 1;
        }


    }
    result.push("</ol>");

    return result.join("");
}