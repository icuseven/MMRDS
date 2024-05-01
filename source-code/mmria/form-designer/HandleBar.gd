@tool
extends Node2D
class_name HandleBar

var is_entered = false
var is_dragging = false

@export var radius:int = 5
var CollisionShape:CircleShape2D

var area:Area2D

func _enter_tree():
	area = $Area2D
	area.connect("mouse_entered", _on_mouse_enter)
	area.connect("mouse_exited", _on_mouse_exited)
	CollisionShape = $Area2D/CollisionShape2D.shape
	CollisionShape.radius = radius
	area.position = Vector2.ZERO
	print("handlebar enter tree")
	
func _ready():
	pass

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	pass
	

func update_position(value:Vector2):
	position = value
	queue_redraw()
	

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
	print("HandleBar mouse Enterd")
	is_entered = true
	queue_redraw()
	
	
func _on_mouse_exited():
	#print("HandleBar mouse Exited")
	is_entered = false
	queue_redraw()

