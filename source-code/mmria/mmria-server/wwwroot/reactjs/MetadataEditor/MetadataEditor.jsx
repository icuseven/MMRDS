function editor_render(p_metadata, p_path, p_ui, p_object_path) {
  var result = [];

  switch (p_metadata.type.toLowerCase()) {
    case 'grid':
    case 'group':
    case 'form':
      result.push(
        `<li path="${p_path}">
					<input type="button" value="-" onclick="editor_toggle(this, g_ui)"/>
					<input type="button" value="^" onclick="editor_move_up(this, g_ui)" />`
      );
      if (p_metadata.type.toLowerCase() != 'form') {
        result.push(
          `<input type="button" value="c"  onclick="editor_set_copy_clip_board(this,'${p_path}')" />`
        );
      }
      result.push(
        `<input type="button" value="d" onclick="editor_delete_node(this,'${p_path}')"/> ${p_metadata.name}`
      );
      Array.prototype.push.apply(
        result,
        render_attribute_add_control(p_path, p_metadata.type)
      );
      result.push(
        `<input type="button" value="ps" onclick="editor_paste_to_children('${p_path}', true)" />
				<input type="button" value="kp" onclick="editor_cut_to_children('${p_path}', true)" />
				<br/>
				<ul tag="attribute_list" style="display:${
          p_ui.is_collapsed[p_path] ? 'none' : 'block'
        }">`
      );
      Array.prototype.push.apply(
        result,
        attribute_renderer(p_metadata, p_path)
      );
      result.push(
        `<li path="${p_path}'/children">
					<input type="button" value="-" onclick="editor_toggle(this, g_ui)"/>
					children: <select path="${p_path}" />
											<option></option>`
      );
      valid_types.forEach((item) => {
        if (item.toLowerCase() != 'app')
          result.push(`<option>${item}</option>`);
      });
      result.push(
        `</select>
				<input type="button" value="add" onclick="editor_add_to_children(this, g_ui)" path="${p_path}: />
				<input type="button" value="p" onclick="editor_paste_to_children('${p_path}')" />
				<input type="button" value="k" onclick="editor_cut_to_children('${p_path}')" /> ${p_object_path}
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
				<input type="button" value="add new item to ${p_metadata.name} ${p_metadata.type} " onclick="editor_add_to_children(this, g_ui)" path="${p_path}"/>
				<input type="button" value="p" onclick="editor_paste_to_children('${p_path}')" />
				<input type="button" value="k" onclick="editor_cut_to_children('${p_path}')" />
				</li>
				</ul></li></ul></li>`
      );
      break;
    case 'app':
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
						<input type="button" value="-" onclick="editor_toggle(this, g_ui)" />
						lookup: <input type="button" value="add list" onclick="editor_add_list(this)"/>
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
				<input type="button" value="-" onclick="editor_toggle(this, g_ui)" />
				children: <input type="button" value="add" onclick="editor_add_form(this)"/>
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
      if (p_metadata.type.toLowerCase() == 'hidden') {
        p_metadata.data_type = 'string';
      }
      result.push(
        `<li path="${p_path}">
				<input type="button" value="-" onclick="editor_toggle(this, g_ui)"/>
				<input type="button" value="^" onclick="editor_move_up(this, g_ui)"/>
				<input type="button" value="c" onclick="editor_set_copy_clip_board(this,'${p_path}')" />
				<input type="button" value="d" onclick="editor_delete_node(this,'${p_path}')" /> ${p_metadata.name}`
      );
      Array.prototype.push.apply(
        result,
        render_attribute_add_control(p_path, p_metadata.type)
      );
      result.push(
        `<input type="button" value="ps" onclick="editor_paste_to_children('${p_path}', true)" />
				<input type="button" value="kp" onclick="editor_cut_to_children('${p_path}', true)" />`
      );
      const metaType = p_metadata.type.toLowerCase();
      if (
        (metaType == 'string' || metaType == 'hidden') &&
        (p_metadata.max_length == null || p_metadata.max_length == '')
      ) {
        result.push(
          `<input type="button" value="upgrade to 500 limit" onclick="editor_add_500Limit('${p_path}')" style="background-color:aqua;" />`
        );
      }
      if (
        metaType == 'textarea' &&
        (p_metadata.max_length == null || p_metadata.max_length == '')
      ) {
        result.push(
          `<input type="button" value="upgrade to 32K limit" onclick="editor_add_30K('${p_path}')" style="background-color:cadetblue;" /> ${p_object_path}
					<ul tag="attribute_list" style="display:${
            p_ui.is_collapsed[p_path] ? 'none' : 'block'
          }">`
        );
      }
      Array.prototype.push.apply(
        result,
        attribute_renderer(p_metadata, p_path)
      );
      result.push('</ul></li>');
      break;
    case 'yes_no':
    case 'race':
    case 'list':
      result.push(`<li path="${p_path}" />`);
      result.push(
        `<input type="button" value="-"  onclick="editor_toggle(this, g_ui)"/>
					<input type="button" value="^" onclick="editor_move_up(this, g_ui)" />
					<input type="button" value="c"  onclick="editor_set_copy_clip_board(this,'${p_path}')" />
					<input type="button" value="d" onclick="editor_delete_node(this,'${p_path}')"/>`
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
        `<input type="button" value="ps" onclick="editor_paste_to_children('${p_path}', true)" />
					<input type="button" value="kp" onclick="editor_cut_to_children('${p_path}', true)" />
					${p_object_path}
					<br/>
					<ul tag="attribute_list">`
      );
      Array.prototype.push.apply(
        result,
        attribute_renderer(p_metadata, p_path)
      );
      result.push(
        `<li>
					values: <input type="button" value="add" onclick="editor_add_value('${p_path}/values')" /> `
      );

      const negativeValue = p_metadata.values.find((item) => item.value < 0);
      let is_conversion_needed = !!negativeValue;
      if (is_conversion_needed) {
        result.push(
          `<input type="button" value="upgrade to numeric/display" onclick="editor_upgrade_numeric_and_display('${p_path}/values')" style="background-color: blanchedalmond;" />`
        );
      }
      result.push('<ul>');

      p_metadata.values.forEach((child, index) => {
        result.push(
          `<li path"${p_path}/values/${index}">
						<input type="button" value="^" onclick="editor_move_up(this, g_ui)"/>
						<input type="button" value="d" onclick="editor_delete_value(this,'${
              p_path + '/values/' + index
            })" />
						value: <input type="text" value="${child.value}" size=${
            child.value.length + 5
          } onBlur="editor_set_value(this, g_ui)" path="${
            p_path + '/values/' + index + '/value'
          }" />
						display: <input type="text" value="${child.display}" size=${
            child.display
              ? child.display.length == 0
                ? 20
                : child.display.length + 5
              : 20
          } onBlur="editor_set_value(this, g_ui)" path="${
            p_path + '/values/' + index + '/display'
          }" />
						description: <input type="text" value="${child.description}" size=${
            child.description.length == 0 ? 20 : child.description.length + 5
          } onBlur="editor_set_value(this, g_ui)" path="${
            p_path + '/values/' + index + '/description'
          }" />
					</li>`
        );
      });
      result.push('</ul></li></ul></li>');
      break;
    case 'chart':
      result.push(
        `<li path="${p_path}">
					<input type="button" value="-" onclick="editor_toggle(this, g_ui)"/>
					<input type="button" value="^" onclick="editor_move_up(this, g_ui)"/>
					<input type="button" value="c" onclick="editor_set_copy_clip_board(this,'${p_path}')" />
					<input type="button" value="d" onclick="editor_delete_node(this,'${p_path}')" /> ${p_metadata.name}`
      );
      Array.prototype.push.apply(
        result,
        render_attribute_add_control(p_path, p_metadata.type)
      );
      result.push(
        `<input type="button" value="ps" onclick="editor_paste_to_children('${p_path}', true)" />
				<input type="button" value="kp" onclick="editor_cut_to_children('${p_path}', true)" />
				${p_object_path}
				<ul tag="attribute_list" style="display:${
          p_ui.is_collapsed ? 'none' : 'block'
        }">`
      );
      Array.prototype.push.apply(
        result,
        attribute_renderer(p_metadata, p_path)
      );
      result.push('</ul></li>');
      break;
    default:
      console.log('editor_render not processed', p_metadata);
      break;
  }
  return result;
}

class MetadataEditor extends React.Component {
  render() {
    const {p_metadata, p_path, p_ui, p_object_path} = this.props;
    return (

    );
  }
}