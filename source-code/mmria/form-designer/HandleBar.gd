extends Node2D
class_name HandleBar

var is_entered = false
var is_dragging = false

@export var radius:int = 5

var area:Area2D

func _ready():
	area = $Area2D
	area.connect("mouse_entered", _on_mouse_enter)
	area.connect("mouse_exited", _on_mouse_exited)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	

func _input(event):
	if !is_entered:
		return
		
	if event is InputEventMouseMotion:
		pass
		if is_dragging:
			pass
	elif event is InputEventMouseButton:
		
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				is_dragging = true
				print("HandleBar is dragging")
			else:
				is_dragging = false
				
	queue_redraw()

func _draw():
	if is_entered:
		draw_circle(position, radius, Color.YELLOW_GREEN)
	else:
		draw_circle(position, radius, Color.YELLOW)
	
	
	
func _on_mouse_enter():
	#print("HandleBar Area Enterd")
	is_entered = true
	
	
func _on_mouse_exited():
	#print("HandleBar Area Exited")
	is_entered = false


