@tool
extends Node2D

@export var width:float = 40
@export var height:float = 20
@export var top:float = 20
@export var left:float = 20

@export var color:Color = Color.RED

var TopLeftHandleBar:HandleBar
var BottomRightHandleBar:HandleBar

var start:Vector2 = Vector2.ZERO
var end:Vector2 = Vector2.ZERO

func _enter_tree():

	print("group field enter_tree")

func _ready():
	print("group field ready")
	TopLeftHandleBar = $TopLeftHandleBar
	BottomRightHandleBar = $BottomRightHandleBar
	_calc_positions()
	TopLeftHandleBar.update_position(start)
	BottomRightHandleBar.update_position(end)
	queue_redraw()
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func _calc_positions():
	var x_diff = width / 2.0
	var y_diff = height / 2.0
	start = Vector2(- x_diff, -y_diff)
	end = Vector2(x_diff, y_diff)

func _draw():
	var point_array:PackedVector2Array
	point_array.append(start)
	point_array.append(Vector2(end.x, start.y))
	point_array.append(end)
	point_array.append(Vector2(start.x, end.y))
	
	#raw_line(point_array[0], point_array[3], Color.BLUE)
	
	draw_line(point_array[0], point_array[1], color)
	draw_line(point_array[1], point_array[2], color)
	draw_line(point_array[2], point_array[3], color)
	draw_line(point_array[3], point_array[0], color)
	
	draw_circle(Vector2.ZERO, 3, Color.ALICE_BLUE)
