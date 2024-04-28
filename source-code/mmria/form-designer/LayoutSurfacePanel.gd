extends Panel

var lasso_start:Vector2 = Vector2.ZERO
var lasso_end:Vector2 = Vector2.ZERO
var lasso_color:Color = Color.YELLOW
var drag_start:bool = false
# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _input(event):
	if event is InputEventMouseMotion:
		lasso_end = get_local_mouse_position()
		queue_redraw()	
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_RIGHT and !event.pressed:
			print("right mouse button event at %s event_pressed: %s", event.position, event.pressed)
		elif event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				drag_start = true
				lasso_start = get_local_mouse_position()
				#LassoOffset = LassoStart - event.position
			else:
				#print("Left mouse button event at %s event_pressed: %s", event.position, event.pressed)
				drag_start = false
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
			print("Wheel up")			
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_T:
			if event.shift_pressed:
				print("Shift+T was pressed")
			else:
				print("T was pressed")


func _draw():
	if drag_start:
		var point_array:PackedVector2Array
		point_array.append(lasso_start)
		point_array.append(Vector2(lasso_end.x, lasso_start.y))
		point_array.append(Vector2(lasso_start.x, lasso_end.y))
		point_array.append(lasso_end)
		#raw_line(point_array[0], point_array[3], Color.BLUE)
		
		draw_line(point_array[0], point_array[1], lasso_color)
		draw_line(point_array[0], point_array[2], lasso_color)
		draw_line(point_array[2], point_array[3], lasso_color)
		draw_line(point_array[3], point_array[1], lasso_color)
