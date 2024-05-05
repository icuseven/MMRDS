extends Panel

var lasso_start:Vector2 = Vector2.ZERO
var lasso_end:Vector2 = Vector2.ZERO
var lasso_color:Color = Color.YELLOW
var lasso_is_dragging:bool = false

var selection_is_dragging:bool = false

var LassoArea:Area2D
var LassoCollisionShap:RectangleShape2D

var SelectedItemList:Dictionary = {}

# Called when the node enters the scene tree for the first time.
func _ready():
	LassoArea = $LassoArea2D
	LassoCollisionShap = $LassoArea2D/CollisionShape2D.shape
	
	LassoArea.connect("area_entered", _lasso_on_enter)
	LassoArea.connect("area_exited", _lasso_on_exited)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	pass


func _input(event):
	if event is InputEventMouseMotion:
		if lasso_is_dragging:
			
			lasso_end = get_local_mouse_position()		
			var size_x = (lasso_start.x - lasso_end.x)
			var size_y = (lasso_start.y - lasso_end.y)
	
			LassoArea.position = lasso_start - Vector2(size_x, size_y) /2
			LassoCollisionShap.size = Vector2(abs(size_x), abs(size_y))
		elif selection_is_dragging:
			pass
			
				
			
		queue_redraw()	
	elif event is InputEventMouseButton:
		
		#if event.button_index == MOUSE_BUTTON_RIGHT and !event.pressed:
		#	print("right mouse button event at %s event_pressed: %s", event.position, event.pressed)
		if event.button_index == MOUSE_BUTTON_RIGHT: # && event.shift_pressed:
			if event.pressed:
				lasso_is_dragging = true
				lasso_start = get_local_mouse_position()
				
				#LassoArea.position = lasso_start
				#LassoOffset = LassoStart - event.position
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
					lasso_is_dragging = false
				queue_redraw()
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			print("Wheel up")			
		elif event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				if !selection_is_dragging:
					for item:GroupField in SelectedItemList.keys():
						if !selection_is_dragging:
							item.set_to_drag()
						
						item.set_drag_motion()
						print(item.name)
					selection_is_dragging = true
				
			else:
				pass
				if selection_is_dragging:
					#for item in SelectedItemList.keys():
					#	item.set_drag_motion(false)
					selection_is_dragging = false
				
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
