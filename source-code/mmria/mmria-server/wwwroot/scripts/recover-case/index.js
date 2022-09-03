
const view_model = {

    search_text: "",
    search_results: [],
    selected_id: ""
};



window.onload = main;


async function main()
{
    await render();
}


async function render()
{
    const el = document.getElementById("output")
    el.innerHTML = render_search_ui();

    if
    (
        view_model.selected_id != null &&
        view_model.selected_id != ""
    )
    {
        render_versions_for_selected_id();
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

async function show_versions_for_id_click(p_id)
{
    view_model.selected_id = p_id;
    render();
}

async function render_versions_for_selected_id()
{

}