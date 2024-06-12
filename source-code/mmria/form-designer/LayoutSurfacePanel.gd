extends Panel

var is_debug_mode = false

var lasso_start:Vector2 = Vector2.ZERO
var lasso_end:Vector2 = Vector2.ZERO
var lasso_color:Color = Color.YELLOW
var lasso_is_dragging:bool = false

var selection_is_dragging:bool = false

var LassoArea:Area2D
var LassoCollisionShap:RectangleShape2D

var SelectedItemList:Dictionary = {}

var mouse_position = [Vector2.ZERO, Vector2.ZERO]
var selected_differnce = Vector2.ZERO

# Called when the node enters the scene tree for the first time.
func _ready():
	LassoArea = $LassoArea2D
	LassoCollisionShap = $LassoArea2D/CollisionShape2D.shape
	
	
	
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	pass

func set_lasso_event_connection_to(value:bool):
	
	if value == true:
		if not LassoArea.is_connected("area_entered", _lasso_on_enter):
			LassoArea.connect("area_entered", _lasso_on_enter)
		
		if not LassoArea.is_connected("area_exited", _lasso_on_exited):
			LassoArea.connect("area_exited", _lasso_on_exited)
	else:
		if LassoArea.is_connected("area_entered", _lasso_on_enter):
			LassoArea.disconnect("area_entered", _lasso_on_enter)
			
		if LassoArea.is_connected("area_exited", _lasso_on_exited):
			LassoArea.disconnect("area_exited", _lasso_on_exited)
		


func _input(event):
	if event is InputEventMouseMotion:
		if lasso_is_dragging:
			
			lasso_end = get_local_mouse_position()		
			var size_x = (lasso_start.x - lasso_end.x)
			var size_y = (lasso_start.y - lasso_end.y)
	
			LassoArea.position = lasso_start - Vector2(size_x, size_y) /2
			LassoCollisionShap.size = Vector2(abs(size_x), abs(size_y))
		elif selection_is_dragging:
			mouse_position[1] = get_local_mouse_position()	
			
				
		
		queue_redraw()	
	elif event is InputEventMouseButton:
		
		#if event.button_index == MOUSE_BUTTON_RIGHT and !event.pressed:
		#	print("right mouse button event at %s event_pressed: %s", event.position, event.pressed)
		if event.button_index == MOUSE_BUTTON_RIGHT: # && event.shift_pressed:
			if event.pressed:
				lasso_is_dragging = true
				lasso_start = get_local_mouse_position()
				lasso_end = get_local_mouse_position()
				set_lasso_event_connection_to(true)
				
				#LassoArea.position = lasso_start
				#LassoOffset = LassoStart - event.position
				queue_redraw()
			else:
				#print("Left mouse button event at %s event_pressed: %s", event.position, event.pressed)
				#for area in LassoArea.get_overlapping_areas():
				#	print("OverLapping %s",area)
				if lasso_is_dragging:
					#for item in LassoArea.get_overlapping_areas():
					#	if item.get_parent() is GroupField:
					#		print(item.name)
							
					for item in SelectedItemList.keys():
						#print(item.name)
						pass
					set_lasso_event_connection_to(false)
					lasso_is_dragging = false
				queue_redraw()
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			print("Wheel up")			
		elif event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				if !selection_is_dragging:
					mouse_position[0] = get_local_mouse_position()
					mouse_position[1] = mouse_position[1]
					print("Selected Global Position: %s" % get_global_mouse_position())
					for item:GroupField in SelectedItemList.keys():
						if !selection_is_dragging:
							item.set_to_drag(get_global_mouse_position())
						
						item.set_drag_motion()
						print(item.name)
						
					
					selection_is_dragging = true
					queue_redraw()
				
			else:
				pass
				if selection_is_dragging:
					#for item in SelectedItemList.keys():
					#	item.set_drag_motion(false)
					selection_is_dragging = false
					mouse_position[1] = get_local_mouse_position()
					selected_differnce = mouse_position[0] - mouse_position[1]
					
					for item:GroupField in SelectedItemList.keys():
						item.move_by(selected_differnce)
						
						
					
					if not is_debug_mode:
						print("selected_difference: %s" % selected_differnce)
					queue_redraw()
				
			pass
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_T:
			if event.shift_pressed:
				print("Shift+T was pressed")
			else:
				print("T was pressed")


func _draw():
	if lasso_is_dragging:
		var point_array:PackedVector2Array = []
		point_array.append(lasso_start)
		point_array.append(Vector2(lasso_end.x, lasso_start.y))
		point_array.append(lasso_end)
		point_array.append(Vector2(lasso_start.x, lasso_end.y))
		#raw_line(point_array[0], point_array[3], Color.BLUE)
		
		draw_line(point_array[0], point_array[1], lasso_color)
		draw_line(point_array[1], point_array[2], lasso_color)
		draw_line(point_array[2], point_array[3], lasso_color)
		draw_line(point_array[3], point_array[0], lasso_color)
	else:
		pass
		
		
		
		
	if mouse_position[0] != Vector2.ZERO and mouse_position[1] != Vector2.ZERO:
		draw_circle(mouse_position[0], 5, Color.CORAL)
		draw_circle(mouse_position[1], 5, Color.BLANCHED_ALMOND)
		draw_line(mouse_position[0],mouse_position[1],Color.AQUA, 1.0)
	
	if is_debug_mode:
		draw_circle(%GroupField.position, 5, Color.YELLOW)
		draw_circle(%GroupField2.position, 5, Color.YELLOW)

		

func _lasso_on_enter(area: Area2D):
	#print("Lasso Area Enterd")
	if area.get_parent() is GroupField:
		var parent =  area.get_parent() as GroupField
		SelectedItemList[parent] = true
		parent.set_to_selected()
	pass
	
	
func _lasso_on_exited(area: Area2D):
	#print("Lasso Area Exited")
	if area.get_parent() is GroupField:
		var parent =  area.get_parent() as GroupField
		if SelectedItemList.has(parent):
			SelectedItemList.erase(parent)
		parent.unset_to_selected()
	pass
