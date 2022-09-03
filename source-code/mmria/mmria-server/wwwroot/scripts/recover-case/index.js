
const view_model = {

    search_text: "",
    search_results: [],
    selected_id: "",
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
    <p>Enter Record Id:
    <input id="search_text"
        value="${view_model.search_text}" />
    <input type="button" onclick="search_text_click()" value="Search" />
    
    <ul>
        ${result.join("")}
    </ul>

    `;
}

async function search_text_click()
{
    const search_text = document.getElementById("search_text").value;
    view_model.selected_id == "";
    view_model.search_text = search_text;
    view_model.search_results = await get_case_view(search_text);

    console.log(view_model.search_results);

    await render();
}


async function get_case_view(p_search_text)
{
    const result = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/case_view?skip=0&take=100&field_selection=by_record_id&search_key=${encodeURIComponent(p_search_text)}`
    });


    
    return result;
}

async function get_case_revision_list(p_case_id)
{
    const result = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/caseRevisionList?case_id=${p_case_id}`
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
        for(var i in array)
        {
            result.push(`<li>${array[i]}</li>`);
        }

    }
    result.push("</ol>");

    return result.join("");
}