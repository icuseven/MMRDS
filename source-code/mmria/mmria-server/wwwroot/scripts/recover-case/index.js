
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
}

function render_search_ui()
{

    let result = [];
    if
    (
        view_model.search_results != null &&
        view_model.search_results.rows != null
    )
    {
        for(const row in view_model.search_results.rows)
        {
            const detail = view_model.search_results.rows[row].value;
            const id = view_model.search_results.rows[row].id;

            result.push(`
            <li>
                <input type="button" onclick="select_id_click('${id}')" value="select" />
                ${detail.last_name}, ${detail.first_name} ${detail.record_id}
                created: ${detail.date_created} ${detail.created_by}<br/>
                last updated: ${detail.date_last_updated} ${detail.last_updated_by}
            </li>
            `);
        }
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

async function select_id_click(p_id)
{
    view_model.search_results.selected_id = p_id;
}