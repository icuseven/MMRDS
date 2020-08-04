var colors = [];
colors.push(0xff8888);
colors.push(0x88ff88);
colors.push(0x8888ff);

const valid_types = [
  'string',
  'hidden',
  'number',
  'datetime',
  'date',
  'list',
  'app',
  'form',
  'grid',
  'group',
  'time',
  'textarea',
  'boolean',
  'label',
  'button',
  'address',
  'chart',
  'jurisdiction',
];

function preEditorRender(p_metadata) {
  if (p_metadata.tags != null) {
    if (
      p_metadata.control_style != null &&
      p_metadata.control_style.toLowerCase() == 'editable' &&
      p_metadata.tags.indexOf('EDITABLELIST') == -1
    ) {
      p_metadata.tags.push('EDITABLELIST');
    }
    if (
      p_metadata.is_core_summary == true &&
      p_metadata.tags.indexOf('COREVARIABLE') == -1
    ) {
      p_metadata.tags.push('COREVARIABLE');
    }

    if (
      p_metadata.is_required == true &&
      p_metadata.tags.indexOf('REQUIRED') == -1
    ) {
      p_metadata.tags.push('REQUIRED');
    }
  }
}

const controls = {
  inputGeneral: (value, callback, options = {}) => {
    const style = options.style ? ` style="${options.style}"` : '';
    const path = options.path ? ` path="${options.path}"` : '';
    return `<input type="button" value="${value}" onclick="${callback}"${style}${path}/>`;
  },
  toggle() {
    return this.inputGeneral('-', 'editor_toggle(this, g_ui)');
  },
  moveUp() {
    return this.inputGeneral('^', 'editor_move_up(this, g_ui)');
  },
  copy(p_path) {
    return this.inputGeneral(
      'c',
      `editor_set_copy_clip_board(this,'${p_path}')`
    );
  },
  delete(p_path) {
    return this.inputGeneral('d', `editor_delete_node(this,'${p_path}')`);
  },
  paste(p_path) {
    return this.inputGeneral(
      'ps',
      `editor_paste_to_children('${p_path}', true)`
    );
  },
  cutPaste(p_path) {
    return this.inputGeneral('kp', `editor_cut_to_children('${p_path}', true)`);
  },
  cut(p_path) {
    return this.inputGeneral('k', `editor_cut_to_children('${p_path}')`);
  },
  add(displayText, callback, path = '') {
    return this.inputGeneral(displayText, callback, { path });
  },
};

function renderApp({ p_metadata, p_path, p_ui, p_object_path }) {
  const result = [];
  result.push(
    `<div style="margin-top:10px" path="/" > ${p_metadata.name}
      <ul tag="attribute_list" style="display:${
        p_ui.is_collapsed['/'] ? 'none' : 'block'
      }">`
  );
  Array.prototype.push.apply(result, attribute_renderer(p_metadata, '/'));
  // lookup - begin
  if (p_metadata.lookup) {
    result.push(
      `<li path="${p_path}/lookup" >
        ${controls.toggle()}
        lookup: ${controls.add('add list', 'editor_add_list(this)')}
        <ul>`
    );
    p_metadata.lookup.forEach((child, index) => {
      Array.prototype.push.apply(
        result,
        editor_render(
          child,
          '/lookup/' + index,
          p_ui,
          p_object_path + '/lookup/' + child.name
        )
      );
    });
    result.push('</ul></li>');
  }
  // lookup - end
  result.push(
    `<li path="${p_path + '/children'}">
    ${controls.toggle()}
    children: ${controls.add('add', 'editor_add_form(this)')}
    <ul>`
  );
  p_metadata.children.forEach((child, index) => {
    Array.prototype.push.apply(
      result,
      editor_render(
        child,
        '/children/' + index,
        p_ui,
        p_object_path + '/' + child.name
      )
    );
  });
  result.push('</ul></li></ul></div>');
  return result;
}

function renderGridGroupForm({ p_metadata, p_path, p_ui, p_object_path }) {
  const result = [];
  result.push(
    `<li path="${p_path}">
      ${controls.toggle()}
      ${controls.moveUp()}`
  );
  if (p_metadata.type.toLowerCase() != 'form') {
    result.push(controls.copy(p_path));
  }
  result.push(controls.delete(p_path) + `${p_metadata.name}`);
  Array.prototype.push.apply(
    result,
    render_attribute_add_control(p_path, p_metadata.type)
  );
  result.push(
    controls.paste(p_path) +
      controls.cutPaste(p_path) +
      `<br/>
    <ul tag="attribute_list" style="display:${
      p_ui.is_collapsed[p_path] ? 'none' : 'block'
    }">`
  );
  Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
  result.push(
    `<li path="${p_path}'/children">
      ${controls.toggle()}
      children: <select path="${p_path}" />
                  <option></option>`
  );
  valid_types.forEach((item) => {
    if (item.toLowerCase() != 'app') result.push(`<option>${item}</option>`);
  });
  result.push(
    `</select>
    ${controls.add('add', 'editor_add_to_children(this, g_ui)', p_path)}
    ${controls.paste(p_path)}
    ${controls.cut(p_path)}
     ${p_object_path}
    <ul>`
  );
  p_metadata.children.forEach((child, index) => {
    Array.prototype.push.apply(
      result,
      editor_render(
        child,
        p_path + '/children/' + index,
        p_ui,
        p_object_path + '/' + child.name
      )
    );
  });
  result.push(
    `<li>
      <select path="${p_path} />
        <option></option>`
  );
  valid_types.forEach((item) => {
    if (item.toLowerCase() != 'app') {
      result.push(`<option>${item}</option>`);
    }
  });
  result.push(
    `</select>
              ${controls.add(
                `add new item to ${p_metadata.name} ${p_metadata.type}`,
                'editor_add_to_children(this, g_ui)',
                p_path
              )}
              ${controls.paste(p_path)}
              ${controls.cut(p_path)}
            </li>
          </ul>
        </li>
      </ul>
    </li>`
  );
  return result;
}

function renderGeneral({ p_metadata, p_path, p_ui, p_object_path }) {
  // for the following cases:
  // 'label','button','boolean','date','datetime',
  // 'number','string','time','address','textarea',
  // 'hidden','jurisdiction'
  const result = [];
  if (p_metadata.type.toLowerCase() == 'hidden') {
    p_metadata.data_type = 'string';
  }
  result.push(
    `<li path="${p_path}">
      ${controls.toggle()}
      ${controls.moveUp()}
      ${controls.copy(p_path)}
      ${controls.delete(p_path)}
      ${p_metadata.name}`
  );
  Array.prototype.push.apply(
    result,
    render_attribute_add_control(p_path, p_metadata.type)
  );
  result.push(controls.paste(p_path) + controls.cutPaste(p_path));
  const metaType = p_metadata.type.toLowerCase();
  if (
    (metaType == 'string' || metaType == 'hidden') &&
    (p_metadata.max_length == null || p_metadata.max_length == '')
  ) {
    result.push(
      controls.inputGeneral(
        'upgrade to 500 limit',
        `editor_add_500Limit('${p_path}')`,
        { style: 'background-color:aqua;' }
      )
    );
  }
  if (
    metaType == 'textarea' &&
    (p_metadata.max_length == null || p_metadata.max_length == '')
  ) {
    result.push(
      controls.inputGeneral(
        'upgrade to 32K limit',
        `editor_add_30K('${p_path}')`,
        { style: 'background-color:cadetblue;' }
      ) +
        `${p_object_path}
      <ul tag="attribute_list" style="display:${
        p_ui.is_collapsed[p_path] ? 'none' : 'block'
      }">`
    );
  }
  Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
  result.push('</ul></li>');
  return result;
}

function renderYesnoRaceList({ p_metadata, p_path, p_ui, p_object_path }) {
  const result = [];

  result.push(`<li path="${p_path}" />`);
  result.push(
    controls.toggle() +
      controls.moveUp() +
      controls.copy(p_path) +
      controls.delete(p_path)
  );
  result.push(p_metadata.name);
  if (p_metadata.data_type == null) {
    if (p_metadata.list_item_data_type != null) {
      p_metadata.data_type = p_metadata.list_item_data_type;
      p_metadata.list_item_data_type = null;
    } else {
      p_metadata.data_type = 'number';
    }
  }
  Array.prototype.push.apply(
    result,
    render_attribute_add_control(p_path, p_metadata.type)
  );
  result.push(
    controls.paste(p_path) +
      controls.cutPaste(p_path) +
      `${p_object_path}
      <br/>
      <ul tag="attribute_list">`
  );
  Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
  result.push(
    `<li>
      values: ${controls.add('add', `editor_add_value('${p_path}/values')`)}`
  );

  const negativeValue = p_metadata.values.find((item) => item.value < 0);
  let is_conversion_needed = !!negativeValue;
  if (is_conversion_needed) {
    result.push(
      controls.inputGeneral(
        'upgrade to numeric/display',
        `editor_upgrade_numeric_and_display('${p_path}/values')`,
        { style: 'background-color: blanchedalmond;' }
      )
    );
  }
  result.push('<ul>');

  p_metadata.values.forEach((child, index) => {
    const rootPath = p_path + '/values/' + index;
    const sizes = {
      value: child.value.length + 5,
      display: child.display
        ? child.display.length == 0
          ? 20
          : child.display.length + 5
        : 20,
      description:
        child.description.length == 0 ? 20 : child.description.length + 5,
    };
    function inputFields(selector) {
      return `${selector}: <input type="text" value="${child[selector]}" size=${
        sizes[selector]
      } onBlur="editor_set_value(this, g_ui)" path="${rootPath + '/value'}" />`;
    }
    result.push(
      `<li path"${rootPath}">
        ${controls.moveUp()}
        ${controls.delete(rootPath)}
        ${inputFields('value')}
        ${inputFields('display')}
        ${inputFields('description')}
      </li>`
    );
  });
  result.push('</ul></li></ul></li>');
  return result;
}

function renderChart({ p_metadata, p_path, p_ui, p_object_path }) {
  const result = [];
  result.push(
    `<li path="${p_path}">
      ${controls.toggle()}
      ${controls.moveUp()}
      ${controls.copy(p_path)}
      ${controls.delete(p_path)}
      ${p_metadata.name}`
  );
  Array.prototype.push.apply(
    result,
    render_attribute_add_control(p_path, p_metadata.type)
  );
  result.push(
    controls.paste(p_path) +
      controls.cutPaste(p_path) +
      `${p_object_path}
    <ul tag="attribute_list" style="display:${
      p_ui.is_collapsed ? 'none' : 'block'
    }">`
  );
  Array.prototype.push.apply(result, attribute_renderer(p_metadata, p_path));
  result.push('</ul></li>');
  return result;
}

function editor_render(p_metadata, p_path, p_ui, p_object_path) {
  var result = [];

  switch (p_metadata.type.toLowerCase()) {
    case 'grid':
    case 'group':
    case 'form':
      Array.prototype.push.apply(
        result,
        renderGridGroupForm({ p_metadata, p_path, p_ui, p_object_path })
      );
      break;
    case 'app':
      Array.prototype.push.apply(
        result,
        renderApp({ p_metadata, p_path, p_ui, p_object_path })
      );
      break;
    case 'label':
    case 'button':
    case 'boolean':
    case 'date':
    case 'datetime':
    case 'number':
    case 'string':
    case 'time':
    case 'address':
    case 'textarea':
    case 'hidden':
    case 'jurisdiction':
      Array.prototype.push.apply(
        result,
        renderGeneral({ p_metadata, p_path, p_ui, p_object_path })
      );
      break;
    case 'yes_no':
    case 'race':
    case 'list':
      Array.prototype.push.apply(
        result,
        renderYesnoRaceList({ p_metadata, p_path, p_ui, p_object_path })
      );
      break;
    case 'chart':
      Array.prototype.push.apply(
        result,
        renderChart({ p_metadata, p_path, p_ui, p_object_path })
      );
      break;
    default:
      console.log('editor_render not processed', p_metadata);
      break;
  }
  return result;
}

function attribute_renderer(p_metadata, p_path) {
  var result = [];
  const metaType = p_metadata.type.toLowerCase();
  if (metaType != 'app' && p_metadata.tags == null) {
    p_metadata.tags = [];
  }
  function deleteAttribute() {
    return controls.inputGeneral(
      'd',
      `editor_delete_attribute(this,'${rootPath}')`,
      { path: rootPath }
    );
  }
  for (var prop in p_metadata) {
    const rootPath = p_path + '/' + prop;
    var name_check = prop.toLowerCase();
    switch (name_check) {
      case 'tags':
        result.push(
          `<li>
						tags: <input type="text" value="${p_metadata[prop].join(
              ' '
            )}" onBlur="editor_set_value(this, g_ui)" path="${rootPath}" />
					</li>`
        );
        break;
      case 'children':
      case 'values':
        break;

      case 'data_type':
        const dataType = p_metadata[prop].toLowerCase();
        result.push(
          `<li>
						data_type: <select onChange="editor_set_value(this, g_ui)" path="${rootPath}" />
							<option>select item datatype</option>
							<option${dataType === 'number' ? ' selected' : ''}>number</option>
							<option${dataType === 'string' ? ' selected' : ''}>string</option>
						</select>
						</li>`
        );
        break;
      case 'type':
        if (metaType == 'app') {
          result.push(`<li>${prop} : ${p_metadata[prop]}</li>`);
        } else {
          const type = p_metadata[prop].toLowerCase();
          result.push('<li>type: ');
          if (
            type == 'app' ||
            type == 'list' ||
            type == 'group' ||
            type == 'form' ||
            type == 'chart'
          ) {
            result.push(p_metadata[prop]);
          } else {
            result.push(
              `<select onChange="editor_set_value(this, g_ui)" path="${rootPath}" />`
            );
            valid_types.forEach((item) => {
              switch (item.toLowerCase()) {
                case 'app':
                case 'list':
                case 'group':
                case 'form':
                  break;
                default:
                  const isSelected =
                    p_metadata[prop] &&
                    item.toLowerCase() == p_metadata[prop].toLowerCase();
                  result.push(
                    `<option${isSelected ? ' selected' : ''}>${item}</option>`
                  );
                  break;
              }
            });
            result.push('</select>');
          }
        }
        break;
      case 'name':
      case 'prompt':
        if (metaType == 'app') {
          result.push(`<li>${prop} : ${p_metadata[prop]}</li>`);
        } else if (metaType == 'label' && prop == 'prompt') {
          result.push(
            `<li>${prop}
							<br/>
							<textarea rows=3 cols=35 onBlur="editor_set_value(this, g_ui)" path="${rootPath}" /> ${p_metadata[prop]}
							</textarea>
							</li>`
          );
        } else {
          const size = p_metadata[prop]
            ? p_metadata[prop].length
              ? p_metadata[prop].length + 5
              : 5
            : 15;
          result.push(
            `<li>${prop} : <input type="text" value="${p_metadata[prop]}" size=${size} onBlur="editor_set_value(this, g_ui)" path="${rootPath}" />
						</li>`
          );
        }

        break;
      case 'cardinality':
        if (metaType == 'app') {
          result.push(
            `<li>
						${prop} : ${p_metadata[prop]}
						</li>`
          );
        } else {
          result.push(`<li> ${prop} : `);
          Array.prototype.push.apply(
            result,
            render_cardinality_control(rootPath, p_metadata[prop])
          );
          result.push(' </li>');
        }
        break;
      case 'path_reference':
        result.push(`<li>${prop} : `);
        Array.prototype.push.apply(
          result,
          render_path_reference_control(rootPath, p_metadata[prop])
        );
        result.push(' </li>');
        break;
      case 'is_core_summary':
      case 'is_required':
      case 'is_multiselect':
      case 'is_read_only':
      case 'is_save_value_display_description':
        if (p_metadata[prop]) {
          const checked =
            p_metadata[prop] == true
              ? ' checked="true" value="true"'
              : ' value="false"';
          result.push(
            `<li>
							${prop} : <input type="checkbox" ${checked}" onblur="editor_set_value(this, g_ui)" path="${rootPath}" />
              ${deleteAttribute()}
						</li>`
          );
        }
        break;
      case 'validation':
      case 'onblur':
      case 'onclick':
      case 'onfocus':
      case 'onchange':
      case 'global':
        function textArea(path) {
          return `<textarea rows=5 cols=50 onBlur="editor_set_value(this, g_ui)" path="${path}"`;
        }
        result.push(
          `<li>
          ${prop} : <br />
          ${
            metaType === 'app'
              ? textArea('/')
              : deleteAttribute() + ' <br/> ' + textAreay(rootPath)
          }`
        );

        if (p_metadata[prop]) {
          try {
            if (p_metadata[prop].comments) {
              var temp_ast = escodegen.attachComments(
                p_metadata[prop],
                p_metadata[prop].comments,
                p_metadata[prop].tokens
              );
              result.push(escodegen.generate(temp_ast, { comment: true }));
            } else {
              result.push(escodegen.generate(p_metadata[prop]));
            }
          } catch (err) {
            result.push(p_metadata[prop]);
          }
        } else {
          result.push(p_metadata[prop]);
        }

        result.push('</textarea> </li>');
        break;
      case 'validation_description':
      case 'description':
      case 'grid_template_areas':
      case 'pre_fill':
        result.push(
          `<li>${prop} : ${deleteAttribute()}
            <br/>
            <textarea rows=5 cols=50 onBlur="editor_set_value(this, g_ui)" path="${
              p_path + '/' + prop
            }">${p_metadata[prop]}
            </textarea>
          </li>`
        );
        break;
      case 'regex_pattern':
        const size = p_metadata[prop]
          ? p_metadata[prop].length
            ? p_metadata[prop].length + 7
            : 20
          : 20;
        result.push(
          `<li>
            ${prop}: <input type="text" value="${
            p_metadata[prop]
          }" size=${size} onBlur="editor_set_value(this, g_ui)" path="${rootPath}" reg_ex_path="${rootPath}" /> ${deleteAttribute()}
          </li>
          test pattern: <input type="text" value="" onchange="check_reg_ex(this,'${rootPath}')"  onblur="check_reg_ex(this,'${rootPath}')"/>
          syntax example: ^\\d\\d$ 2 digit number <a href="https://duckduckgo.com/?q=javascript+regex&t=hq&ia=web">refrence search</a>`
        );
        break;

      case 'list_display_size':
        const size = p_metadata[prop]
          ? p_metadata[prop].length
            ? p_metadata[prop].length + 5
            : 5
          : 5;
        result.push(
          `<li>
            ${prop} : <input type="number" value="${p_metadata[prop]}" size=${size} onBlur="editor_set_value(this, g_ui)" path="${rootPath}" />
            <input type="button" value="d"  onclick="editor_delete_attribute(this,'${rootPath}')"/>
          </li>`
        );
        break;
      case 'decimal_precision':
        const selected =
          p_metadata[prop] && p_metadata[prop] === '' ? 'selected' : '';
        result.push(
          `<li>
            ${prop} : <select onchange="editor_set_value(this, g_ui)" path="${rootPath}" >
              <option ${selected}></option>`
        );

        for (var i = 0; i < 6; i++) {
          const isSelected =
            p_metadata[prop] && +p_metadata[prop] === i ? ' selected' : '';
          result.push(`<option${isSelected}>${i}</option>`);
        }
        result.push(
          `</select>
          <input type="button" value="d"  onclick="editor_delete_attribute(this,'${rootPath}')"/>
        </li>`
        );
        break;

      case 'chart':
        const size = p_metadata[prop]
          ? p_metadata[prop].length
            ? p_metadata[prop].length + 5
            : 5
          : 15;
        result.push(
          `<li>
            ${prop} : <input type="text" value="${p_metadata[prop]}" size=${size} onBlur="editor_set_value(this, g_ui)" path="${rootPath}" />
            <input type="button" value="d"  onclick="editor_delete_attribute(this,'${rootPath}')"/>
          </li>`
        );
        break;
      default:
        if (metaType == 'app') {
          if (prop != 'lookup') {
            result.push(
              `<li>
                ${prop} : ${p_metadata[prop]}
              </li>`
            );
          }
        } else {
          const size = p_metadata[prop]
            ? p_metadata[prop].length
              ? p_metadata[prop].length + 5
              : 5
            : 15;
          result.push(
            `<li>
              ${prop} : <input type="text" value="${p_metadata[prop]}" size=${size} onBlur="editor_set_value(this, g_ui)" path="${rootPath}" />
              <input type="button" value="d"  onclick="editor_delete_attribute(this,'${rootPath}')"/>
            </li>`
          );
        }
        break;
    }
  }
  return result;
}

function render_cardinality_control(p_path, p_value) {
  var result = [];
  function createOpt(val) {
    return `<option${p_value == val ? ' selected' : ''}>${val}</option>`;
  }
  result.push(
    `<select onChange="editor_set_value(this, g_ui)" path="${p_path}">
      ${createOpt('?')}
      ${createOpt('1')}
      ${createOpt('*')}
      ${createOpt('+')}
    </select>`
  );
  return result;
}

function render_path_reference_control(p_path, p_value) {
  var result = [];
  result.push(
    `<select onChange="editor_set_value(this, g_ui)" path="${p_path}">
      <option></option>`
  );
  g_metadata.lookup.forEach((item) => {
    const lookup_path = item.name;
    return `<option${
      p_value == lookup_path ? ' selected' : ''
    }>${lookup_path}</option>`;
  });
  result.push('</select>');
  return result;
}

function render_attribute_add_control(p_path, node_type) {
  const nodeType = node_type.toLowerCase();
  const result = [];
  const is_collection_node = [
    'app',
    'form',
    'group',
    'grid',
    'lookup',
  ].includes(nodeType);
  const is_list = nodeType === 'list';
  const is_range = [
    'string',
    'hidden',
    'number',
    'date',
    'datetime',
    'time',
    'jurisdiction',
  ].includes(nodeType);
  const is_pre_fillable = ['address', 'textarea'].includes(nodeType);
  function opt(...options) {
    result.push(options.map((option) => `<option>${option}</option>`).join(''));
  }
  result.push(` <select path="${p_path}">` + opt('', 'description'));
  const END = `</select>
  <input type="button" value="add optional attribute" onclick="editor_add_to_attributes(this, g_ui)" path="${p_path}" />`;
  if (nodeType == 'chart') {
    opt('x_start', 'control_style');
    result.push(END);
    return result;
  }

  if (!is_collection_node) {
    opt('is_core_summary', 'is_required', 'is_read_only');
    if (nodeType == 'number') {
      opt('decimal_precision');
    }
    if (nodeType == 'string' || nodeType == 'textarea') {
      opt('max_length');
    }

    if (is_list) {
      opt(
        'is_multiselect',
        'list_display_size',
        'is_save_value_display_description'
      );
    }
    opt('default_value', 'regex_pattern');
  } else if (nodeType == 'grid' || nodeType == 'group') {
    opt('is_core_summary', 'is_read_only');
  }

  if (nodeType == 'group') {
    opt(
      'grid_template',
      'grid_gap',
      'grid_auto_flow',
      'grid_template_areas',
      'grid_area',
      'grid_row',
      'grid_column'
    );
  } else if (is_collection_node) {
    // do nothing
  } else {
    opt('grid_area', 'grid_row', 'grid_column');
  }
  if (nodeType == 'app') {
    opt('global');
  }
  opt(
    'validation',
    'validation_description',
    'onfocus',
    'onchange',
    'onblur',
    'onclick',
    'mirror_reference',
    'pre_populate_reference'
  );

  if (!is_collection_node) {
    if (is_pre_fillable) {
      opt('pre_fill');
    }
    if (is_range) {
      opt('max_value', 'min_value');
    }
    if (is_list) {
      opt('control_style', 'path_reference');
    }
  }
  result.push(END);
  return result;
}

function editor_set_value(node) {
  var path = node.attributes['path'].value;
  var path_array = path.split('/');
  var attribute_name = path_array[path_array.length - 1];
  var item_path = get_eval_string(path);

  switch (attribute_name.toLowerCase()) {
    case 'tags':
      let tag_array = node.value.split(' ');
      let new_value = [];
      tag_array.forEach((tag) => {
        if (tag) {
          new_value.push(
            `"${tag
              .trim()
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
              .replace(/,/g, '')
              .toUpperCase()}"`
          );
        }
      });
      eval(item_path + ' = [' + new_value.join(', ') + '] ');
      window.dispatchEvent(metadata_changed_event);
      break;
    case 'name':
      if (eval(item_path) != node.value) {
        if (node.value) {
          var test = node.value.trim().match(/^[a-zA-z][a-zA-z0-9_]*$/);
          if (test) {
            eval(item_path + ' = "' + node.value.trim() + '"');
            window.dispatchEvent(metadata_changed_event);
            node.style.color = 'black';
          } else {
            node.style.color = 'red';
          }
        } else {
          node.style.color = 'red';
        }
      } else if (node.style.color != 'black') {
        node.style.color = 'black';
      }

      break;
    case 'validation':
    case 'onblur':
    case 'onclick':
    case 'onfocus':
    case 'onchange':
    case 'global':
      try {
        var valid_code = esprima.parse(node.value, {
          comment: true,
          tokens: true,
          range: true,
          loc: true,
        });
        var object_array = convert_to_indexed_path(item_path);
        var node_to_update = eval(object_array[0]);
        var attribute_text = object_array[1];
        node_to_update[attribute_text] = valid_code;
        node.style.color = 'black';
      } catch (err) {
        node.style.color = 'red';
        console.log('set from esprima code: ', err);
      }
      break;
    case 'is_core_summary':
    case 'is_required':
    case 'is_multiselect':
    case 'is_read_only':
    case 'is_save_value_display_description':
      eval(item_path + ' = !' + node.value);
      window.dispatchEvent(metadata_changed_event);
      break;
    case 'regex_pattern':
      try {
        if (node.value && node.value != '') {
          eval(
            item_path +
              ' ="' +
              node.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') +
              '"'
          );
        } else {
          eval(item_path + ' = ""');
        }
        node.style.color = 'black';
      } catch (err) {
        node.style.color = 'red';
        console.log('invalid regex_pattern: ', node.value);
      }

      break;
    default:
      eval(
        item_path +
          ' = "' +
          node.value.trim().replace(/"/g, '\\"').replace(/\n/g, '\\n') +
          '"'
      );
      window.dispatchEvent(metadata_changed_event);
      break;
  }
}

function editor_paste_to_children(p_ui, p_is_index_paste) {
  if (g_copy_clip_board) {
    if (p_is_index_paste) {
      var path_array = p_ui.split('/');
      var target_index = path_array[path_array.length - 1];
      if (path_array[1] != 'lookup') {
        path_array.splice(path_array.length - 2, 2);
      } else {
        path_array.splice(path_array.length - 1, 1);
      }
      var collection_path = path_array.join('/');
      var item_path = get_eval_string(collection_path);
      var clone_path = get_eval_string(g_copy_clip_board);
      var clone = editor_clone(eval(clone_path));
      var paste_target = eval(item_path);
      if (paste_target.children) {
        for (var i = 0; i < paste_target.children.length; i++) {
          if (clone.name == paste_target.children[i].name) {
            clone.name = 'new_clone_name_' + paste_target.children.length;
            break;
          }
        }
        paste_target.children.splice(target_index, 0, clone);
      } else {
        for (var i = 0; i < paste_target.length; i++) {
          if (clone.name == paste_target[i].name) {
            clone.name = 'new_clone_name_' + paste_target.length;
            break;
          }
        }
        paste_target.splice(target_index, 0, clone);
      }
      if (collection_path == '' || collection_path == '/lookup') {
        if (collection_path == '/lookup') {
          paste_target = g_metadata;
        }
        var node = editor_render(paste_target, '/', g_ui);
        var node_to_render = document.querySelector("div[path='/']");
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
      } else {
        var node = editor_render(paste_target, collection_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + collection_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
      }
    } else {
      var path_array = p_ui.split('/');
      var item_path = get_eval_string(p_ui);
      var clone_path = get_eval_string(g_copy_clip_board);
      var clone = editor_clone(eval(clone_path));
      var paste_target = eval(item_path);
      for (var i = 0; i < paste_target.children.length; i++) {
        if (clone.name == paste_target.children[i].name) {
          clone.name = 'new_clone_name_' + paste_target.children.length;
          break;
        }
      }
      paste_target.children.push(clone);
      var node = editor_render(paste_target, p_ui, g_ui);
      var node_to_render = document.querySelector("li[path='" + p_ui + "']");
      node_to_render.innerHTML = node.join('');
      window.dispatchEvent(metadata_changed_event);
    }
  }
}

function editor_cut_to_children(p_ui, p_is_index_paste) {
  if (g_copy_clip_board) {
    if (p_is_index_paste) {
      var path_array = p_ui.split('/');
      var target_index = path_array[path_array.length - 1];
      if (path_array[1] != 'lookup') {
        path_array.splice(path_array.length - 2, 2);
      } else {
        path_array.splice(path_array.length - 1, 1);
      }
      var collection_path = path_array.join('/');
      var item_path = get_eval_string(collection_path);
      var clone_path = get_eval_string(g_copy_clip_board);
      var clone = editor_clone(eval(clone_path));
      var paste_target = eval(item_path);
      if (paste_target.children) {
        for (var i = 0; i < paste_target.children.length; i++) {
          if (clone.name == paste_target.children[i].name) {
            clone.name = 'new_clone_name_' + paste_target.children.length;
            break;
          }
        }
        paste_target.children.splice(target_index, 0, clone);
      } else {
        for (var i = 0; i < paste_target.length; i++) {
          if (clone.name == paste_target[i].name) {
            clone.name = 'new_clone_name_' + paste_target.length;
            break;
          }
        }
        paste_target.splice(target_index, 0, clone);
      }
      if (collection_path == '' || collection_path == '/lookup') {
        if (collection_path == '/lookup') {
          paste_target = g_metadata;
        }
        var node = editor_render(paste_target, '/', g_ui);
        var node_to_render = document.querySelector("div[path='/']");
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
      } else {
        var node = editor_render(paste_target, collection_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + collection_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
      }
      if (g_copy_clip_board.indexOf(collection_path) == 0) {
        g_delete_node_clip_board = g_delete_node_clip_board =
          collection_path +
          g_copy_clip_board
            .replace(collection_path, '')
            .replace(/(\d+)/, function (x) {
              return new Number(x) + 1;
            });
        g_copy_clip_board = null;
        editor_delete_node(null, g_delete_node_clip_board);
      } else {
        g_delete_node_clip_board = g_copy_clip_board;
        g_copy_clip_board = null;
        editor_delete_node(null, g_delete_node_clip_board);
      }
    } else {
      var path_array = p_ui.split('/');
      var item_path = get_eval_string(p_ui);
      var clone_path = get_eval_string(g_copy_clip_board);
      var clone = editor_clone(eval(clone_path));
      var paste_target = eval(item_path);
      for (var i = 0; i < paste_target.children.length; i++) {
        if (clone.name == paste_target.children[i].name) {
          clone.name = 'new_clone_name_' + paste_target.children.length;
          break;
        }
      }
      paste_target.children.push(clone);
      var node = editor_render(paste_target, p_ui, g_ui);
      var node_to_render = document.querySelector("li[path='" + p_ui + "']");
      node_to_render.innerHTML = node.join('');
      window.dispatchEvent(metadata_changed_event);
      if (g_copy_clip_board.indexOf(collection_path) == 0) {
        g_delete_node_clip_board =
          collection_path +
          g_copy_clip_board
            .replace(collection_path, '')
            .replace(/(\d+)/, function (x) {
              return new Number(x) + 1;
            });
        g_copy_clip_board = null;
        editor_delete_node(null, g_delete_node_clip_board);
      } else {
        g_delete_node_clip_board = g_copy_clip_board;
        g_copy_clip_board = null;
        editor_delete_node(null, g_delete_node_clip_board);
      }
    }
  }
}

function editor_clone(obj) {
  if (null == obj || 'object' != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      if (attr == 'children') {
        copy[attr] = [];
        for (var i = 0; i < obj[attr].length; i++) {
          copy[attr].push(editor_clone(obj[attr][i]));
        }
      } else if (attr == 'values') {
        copy[attr] = [];
        for (var i = 0; i < obj[attr].length; i++) {
          copy[attr].push(editor_clone(obj[attr][i]));
        }
      } else {
        copy[attr] = obj[attr];
      }
    }
  }
  return copy;
}

function editor_add_to_children(e, p_ui) {
  var element_list = document.querySelectorAll(
    'select[path="' + e.attributes['path'].value + '"]'
  );
  var element_value = null;
  for (var i = 0; i < element_list.length; i++) {
    var el = element_list[i];
    if (el.value) {
      element_value = el.value;
      break;
    }
  }
  if (element_value) {
    var parent_path = e.attributes['path'].value;
    var parent_eval_path = get_eval_string(parent_path);
    var item_path = parent_eval_path + '.children';
    switch (element_value.toLowerCase()) {
      //"app":
      //"form":
      case 'string':
      case 'number':
      case 'date':
      case 'datetime':
      case 'time':
      case 'address':
      case 'textarea':
      case 'boolean':
      case 'label':
      case 'button':
        eval(item_path).push(
          md.create_value(
            'new_' + element_value,
            'new ' + element_value + ' prompt',
            element_value
          )
        );
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'chart':
        eval(item_path).push(
          md.create_chart('new_' + element_value, 'new ' + element_value)
        );
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'list':
        eval(item_path).push(
          md.create_value_list(
            'new_' + element_value,
            'new ' + element_value,
            element_value,
            'list'
          )
        );
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'grid':
        eval(item_path).push(
          md.create_grid('new_' + element_value, 'new ' + element_value)
        );
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'lookup':
        eval(item_path).push(
          md.create_group(
            'new_' + element_value,
            'new ' + element_value,
            element_value
          )
        );
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'group':
        eval(item_path).push(
          md.create_group(
            'new_' + element_value,
            'new ' + element_value,
            element_value
          )
        );
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'form':
        eval(item_path).push(md.create_form('new_form', 'new form', '?'));
        var node = editor_render(eval(parent_eval_path), parent_path, g_ui);
        var node_to_render = document.querySelector(
          "li[path='" + parent_path + "']"
        );
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      default:
        console.log('e.value, path', element_value, e.attributes['path'].value);
        break;
    }
  }
}

function editor_add_to_attributes(e, p_ui) {
  var element = document.querySelector(
    'select[path="' + e.attributes['path'].value + '"]'
  );
  if (element.value) {
    var attribute = element.value.toLowerCase();
    switch (attribute) {
      case 'is_core_summary':
      case 'is_required':
      case 'is_read_only':
      case 'is_multiselect':
      case 'is_save_value_display_description':
        var path = e.attributes['path'].value;
        var item = get_eval_string(path);
        eval(item)[attribute] = true;
        var node = editor_render(eval(item), path, g_ui);
        var node_to_render = document.querySelector("li[path='" + path + "']");
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'default_value':
      case 'description':
      case 'regex_pattern':
      case 'validation':
      case 'validation_description':
      case 'onfocus':
      case 'onchange':
      case 'onblur':
      case 'onclick':
      case 'pre_fill':
      case 'max_length':
      case 'max_value':
      case 'min_value':
      case 'mirror_reference':
      case 'control_style':
      case 'path_reference':
      case 'pre_populate_reference':
      case 'x_start':
      case 'grid_template':
      case 'grid_template_areas':
      case 'grid_gap':
      case 'grid_auto_flow':
      case 'grid_area':
      case 'grid_row':
      case 'grid_column':
        var path = e.attributes['path'].value;
        var item = get_eval_string(path);
        eval(item)[attribute] = new String();
        var node = editor_render(eval(item), path, g_ui);
        var node_to_render = document.querySelector("li[path='" + path + "']");
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'list_display_size':
        var path = e.attributes['path'].value;
        var item = get_eval_string(path);
        eval(item)[attribute] = new Number(1);
        var node = editor_render(eval(item), path, g_ui);
        var node_to_render = document.querySelector("li[path='" + path + "']");
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      case 'decimal_precision':
        var path = e.attributes['path'].value;
        var item = get_eval_string(path);
        eval(item)[attribute] = new Number(1);
        var node = editor_render(eval(item), path, g_ui);
        var node_to_render = document.querySelector("li[path='" + path + "']");
        node_to_render.innerHTML = node.join('');
        window.dispatchEvent(metadata_changed_event);
        break;
      default:
        //console.log("e.value, path", element.value, e.attributes['path'].value);
        break;
    }
  }
}

function editor_delete_attribute(e, p_path) {
  if (p_path == g_delete_attribute_clip_board) {
    g_delete_attribute_clip_board = null;
    var item = get_eval_string(p_path);
    var index = item.lastIndexOf('.');
    var attribute = item.slice(index + 1, item.length);
    var begin = item.slice(0, index);
    var path_index = p_path.lastIndexOf('/');
    var parent_path = p_path.slice(0, path_index);
    delete eval(begin)[attribute];
    var node = editor_render(eval(begin), parent_path, g_ui);
    var node_to_render = document.querySelector(
      "li[path='" + parent_path + "'], li select[path='" + parent_path + "']"
    );
    node_to_render.innerHTML = node.join('');
    window.dispatchEvent(metadata_changed_event);
  } else {
    var node_to_render = null;
    if (g_delete_attribute_clip_board) {
      node_to_render = document.querySelector(
        "li input[path='" +
          g_delete_attribute_clip_board +
          "'], li select[path='" +
          g_delete_attribute_clip_board +
          "']"
      ).parentElement;
      if (node_to_render) {
        node_to_render.style.background = '#FFFFFF';
      }
    }
    node_to_render = document.querySelector(
      "li input[path='" + p_path + "'], li select[path='" + p_path + "']"
    ).parentElement;
    g_delete_attribute_clip_board = p_path;
    node_to_render.style.background = '#999999';
  }
}

function editor_add_value(p_path) {
  var item_path = get_eval_string(p_path);
  eval(item_path).push({ value: 'new value', description: '', display: '' });
  var path_index = p_path.lastIndexOf('/');
  var parent_path = p_path.slice(0, path_index);
  var node = editor_render(
    eval(get_eval_string(parent_path)),
    parent_path,
    g_ui
  );
  var node_to_render = document.querySelector("li[path='" + parent_path + "']");
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_upgrade_numeric_and_display(p_path) {
  var item_path = get_eval_string(p_path);
  var value_list = eval(item_path);
  for (let i = 0; i < value_list.length; i++) {
    if (value_list[i].value == -9) {
      value_list[i].value = 9999;
    } else if (value_list[i].value == -8) {
      value_list[i].value = 8888;
    } else if (value_list[i].value == -7) {
      value_list[i].value = 7777;
    }
  }
  var path_index = p_path.lastIndexOf('/');
  var parent_path = p_path.slice(0, path_index);
  var node = editor_render(
    eval(get_eval_string(parent_path)),
    parent_path,
    g_ui
  );
  var node_to_render = document.querySelector("li[path='" + parent_path + "']");
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_add_30K(p_path) {
  let item_path = get_eval_string(p_path);
  let item = eval(item_path);
  if (item.max_length == null) {
    item.max_length = '31000';
  } else if (item.max_length == '') {
    item.max_length = '31000';
  }
  let node = editor_render(eval(get_eval_string(p_path)), p_path, g_ui);
  let node_to_render = document.querySelector("li[path='" + p_path + "']");
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_add_500Limit(p_path) {
  let item_path = get_eval_string(p_path);
  let item = eval(item_path);
  if (item.max_length == null) {
    item.max_length = '500';
  } else if (item.max_length == '') {
    item.max_length = '500';
  }
  let node = editor_render(eval(get_eval_string(p_path)), p_path, g_ui);
  let node_to_render = document.querySelector("li[path='" + p_path + "']");
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_upgrade_pmss_and_display(p_path) {
  var item_path = get_eval_string(p_path);
  var value_list = eval(item_path);
  for (let i = 0; i < value_list.length; i++) {
    if (value_list[i].value == null || value_list[i].value == '') {
      value_list[i].display = '';
      value_list[i].value = -9;
    } else {
      let split_index = value_list[i].value.indexOf(' ');
      value_list[i].display = value_list[i].value;
      value_list[i].value = value_list[i].value
        .substring(0, split_index)
        .trim();
    }
  }
  var path_index = p_path.lastIndexOf('/');
  var parent_path = p_path.slice(0, path_index);
  var node = editor_render(
    eval(get_eval_string(parent_path)),
    parent_path,
    g_ui
  );
  var node_to_render = document.querySelector("li[path='" + parent_path + "']");
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_delete_value(e, p_path) {
  if (p_path == g_delete_value_clip_board) {
    var item = get_eval_string(p_path);
    var item_index = p_path.match(new RegExp('\\d+$', 'g'));
    var index = item.lastIndexOf('.');
    var begin = item.slice(0, index);
    var path_index = p_path.lastIndexOf('/');
    var temp_path = p_path.slice(0, path_index);
    path_index = temp_path.lastIndexOf('/');
    var parent_path = temp_path.slice(0, path_index);
    eval(begin).values.splice(item_index[0], 1);
    var node = editor_render(eval(begin), parent_path, g_ui);
    var node_to_render = document.querySelector(
      "li[path='" + parent_path + "']"
    );
    node_to_render.innerHTML = node.join('');
    window.dispatchEvent(metadata_changed_event);
    g_delete_value_clip_board = null;
  } else {
    var node_to_render = null;
    if (g_delete_value_clip_board) {
      node_to_render = document.querySelector(
        "li [path='" + g_delete_value_clip_board + "']"
      );
      if (node_to_render) {
        node_to_render.style.background = '#FFFFFF';
      }
    }
    node_to_render = document.querySelector("li [path='" + p_path + "']");
    g_delete_value_clip_board = p_path;
    node_to_render.style.background = '#999999';
  }
}

function editor_set_copy_clip_board(e, p_path) {
  g_copy_clip_board = p_path;
}

function editor_delete_node(e, p_path) {
  if (p_path == g_delete_node_clip_board) {
    g_delete_node_clip_board = null;
    var path_index = p_path.lastIndexOf('/');
    var collection_path = p_path.slice(0, path_index);
    var object_path = get_eval_string(collection_path);
    var index = p_path.match(/\d*$/)[0];
    eval(object_path).splice(index, 1);
    path_index = collection_path.lastIndexOf('/');
    var parent_path = collection_path.slice(0, path_index);
    var node = editor_render(
      eval(get_eval_string(parent_path)),
      parent_path,
      g_ui
    );
    var node_to_render = null;
    if (parent_path != '') {
      node_to_render = document.querySelector("li[path='" + parent_path + "']");
    } else {
      node_to_render = document.querySelector("div[path='/']");
    }
    node_to_render.innerHTML = node.join('');
    window.dispatchEvent(metadata_changed_event);
  } else {
    var node_to_render = null;
    if (g_delete_node_clip_board) {
      node_to_render = document.querySelector(
        "li[path='" + g_delete_node_clip_board + "']"
      );
      if (node_to_render) {
        node_to_render.style.background = '#FFFFFF';
      }
    }
    node_to_render = document.querySelector("li[path='" + p_path + "']");
    g_delete_node_clip_board = p_path;
    node_to_render.style.background = '#999999';
  }
}

function editor_add_form(e) {
  var form = md.create_form('new_form_name', 'form prompt', '?');
  g_metadata.children.push(form);
  var node = editor_render(g_metadata, '', g_ui);
  var node_to_render = document.getElementById('form_content_id');
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_add_list(e) {
  var list = md.create_value_list('new_list_name', 'list prompt', 'list');
  g_metadata.lookup.push(list);
  var node = editor_render(g_metadata, '', g_ui);
  var node_to_render = document.getElementById('form_content_id');
  node_to_render.innerHTML = node.join('');
  window.dispatchEvent(metadata_changed_event);
}

function editor_toggle(e, p_ui) {
  var element = document.querySelector(
    'li[path="' + e.parentElement.attributes['path'].value + '"] ul'
  );
  if (element.style.display == 'none') {
    element.style.display = 'block';
    e.value = '-';
    p_ui.is_collapsed[e.parentElement.attributes['path'].value] = false;
  } else {
    element.style.display = 'none';
    e.value = '+';
    p_ui.is_collapsed[e.parentElement.attributes['path'].value] = true;
  }
  //console.log('toggle: path', e.parentElement.attributes['path']);
}

function editor_move_up(e, p_ui) {
  var current_li = e.parentElement;
  var path = current_li.attributes['path'].value;
  var node_path = get_eval_string(remove_last_digit_in_path(path));
  var list = eval(node_path);
  var y = path.match(/\d*$/)[0];
  var x = y - 1;
  //swap toggle state
  var temp = p_ui.is_collapsed[node_path + y];
  p_ui.is_collapsed[node_path + y] = p_ui.is_collapsed[node_path + x];
  p_ui.is_collapsed[node_path + x] = temp;
  if (x >= 0) {
    var b = list[y];
    list[y] = list[x];
    list[x] = b;
    var parent_path = get_parent_path(path);
    var metadata_path = get_eval_string(parent_path);
    var metadata = eval(metadata_path);
    var node = editor_render(metadata, parent_path, p_ui);
    var node_to_render = null;
    if (parent_path == '') {
      node_to_render = document.querySelector("div[path='/']");
    } else {
      node_to_render = document.querySelector("li[path='" + parent_path + "']");
    }
    node_to_render.innerHTML = node.join('');
    window.dispatchEvent(metadata_changed_event);
  }
}

function remove_last_digit_in_path(p_path) {
  var index = p_path.lastIndexOf('/');
  var result = p_path.substring(0, index);
  return result;
}

function get_eval_string(p_path) {
  var result =
    'g_metadata' +
    p_path
      .replace(new RegExp('/', 'gm'), '.')
      .replace(new RegExp('\\.(\\d+)\\.', 'gm'), '[$1].')
      .replace(new RegExp('\\.(\\d+)$', 'g'), '[$1]');
  return result;
}

function get_parent_path(p_path) {
  var result = null;
  if (p_path.match(new RegExp('/values/(\\d+)$', 'g'))) {
    result = p_path.replace(new RegExp('/values/(\\d+)$', 'g'), '');
  } else {
    result = p_path.replace(new RegExp('/children/(\\d+)$', 'g'), '');
  }
  return result;
}

function convert_to_indexed_path(p_path) {
  // example g_metadata.children[0].validation
  var result = [];
  var temp = p_path.split('.');
  var last = temp[temp.length - 1];
  temp.pop();
  result.push(temp.join('.'));
  result.push(last);
  return result;
}

function check_reg_ex(p_control, p_path) {
  var reg_ex_control = document.querySelector(
    "input[reg_ex_path='" + p_path + "']"
  );
  var value = p_control.value;
  var regexp = new RegExp(reg_ex_control.value);
  var matches_array = value.match(regexp);
  if (matches_array) {
    if (matches_array.length < 1) {
      p_control.style.background = '#FFCCCC';
    } else {
      p_control.style.background = '#FFFFFF';
    }
  } else {
    p_control.style.background = '#FFCCCC';
  }
}
