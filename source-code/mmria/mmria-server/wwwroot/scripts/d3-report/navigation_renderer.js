

function render_navigation_strip(p_current_index)
{
    if(p_current_index < 1)
    {
        return "";
    }

    // Phase 1 Nav Start
    let previous_index = p_current_index - 1;
    let next_index = p_current_index + 1;

    if(previous_index == 3)
    {
        previous_index = 2;
    }

    if(previous_index > 4)
    {
        previous_index = 4;
    }

    if(next_index == 3)
    {
        next_index = 4;
    }

    if(next_index > 4 && next_index < 12)
    {
        next_index = 12;
    }
    // Phase 1 Nav end

    /*

    Phase 2
    const previous_index = p_current_index - 1;
    const next_index = p_current_index + 1;
    */

    const previous_tab_name = g_nav_map.get(previous_index);
    const next_tab_name = g_nav_map.get(next_index);

    let list_options = [];

    g_nav_map.forEach
    (
        (value, index) =>
        {
            if
            (
                index != 3 &&
                ! (
                    index >= 5 &&
                    index <= 11
                )
            )
            {

                if(index == p_current_index)
                {
                    list_options.push(`<option selected value=${index}>${value}</option>`)
                }
                else
                {
                    list_options.push(`<option value=${index}>${value}</option>`)
                }
            }
        }
    );

    if(next_index < 13)
    {
        return `
        <nav role="navigation" aria-label="Previous and Next Pages" class="tp-multipage">
            <ul class="d-flex justify-content-between">
                <li class="tp-mp-prev tp-mp-arrow">
                    <a href="#${previous_index}" title="Previous Page"><span class="d-lg-none">Prev</span><span class="d-none d-lg-inline">${previous_tab_name}</span></a>
                </li>
                <li style="margin-top:15px;">
                    <select onchange="nav_dropdown_change(this.value)">
                        ${list_options.join()}
                    </select>
                </li>
                <li class="tp-mp-next tp-mp-arrow">
                    <a href="#${next_index}" title="Next Page"><span class="d-lg-none">Next</span><span class="d-none d-lg-inline">${next_tab_name}</span></a>
                </li>
            </ul>
        </nav>

    `;
    }
    else
    {
        return `
        <nav role="navigation" aria-label="Previous and Next Pages" class="tp-multipage">
            <ul class="d-flex justify-content-between">
                <li class="tp-mp-prev tp-mp-arrow">
                    <a href="#${previous_index}" title="Previous Page"><span class="d-lg-none">Prev</span><span class="d-none d-lg-inline">${previous_tab_name}</span></a>
                </li>
                <li style="margin-top:15px;">
                    <select onchange="nav_dropdown_change(this.value)">
                        ${list_options.join()}
                    </select>
                </li>
                <li>
                    &nbsp;
                </li>
            </ul>
        </nav>

    `;
    }

}

function nav_dropdown_change(p_value)
{
    window.location = "#" + p_value;
}


